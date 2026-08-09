"use server";

/*

  - Fetches the data shown across the main dashboard, including the metrics cards, connected reposiory, recent reviews, activity chart, and contribution heatmap.

  - The dashboard combines data from GitHub and our own database. GitHub provides live contribution and pull request activity, while our database tracks application-specific data such as connected repositories and AI reviews.

  - Results are cached per user to avoid repeating expensive GitHub API calls on every page load. Cache entries are normally refreshed through explicit invalidation after writes, with the TTL serving as a fallback.

*/

import { requireAuthenticated } from "@/features/auth";
import { getLogger } from "@/server/observability/logger";
import { getOrSet } from "@/server/cache/cache";
import { getCacheTtlConfig } from "@/config/cache-ttl";
import {
  getTotalConnectedRepositories,
  getTotalReviews,
  getReviewsTrend,
} from "@/features/dashboard/server/db-metrics";
import {
  fetchUserContributions,
  getAuthenticatedOctokit,
  withGithubCall,
  type ContributionCalendar,
} from "@/server/github/client";

type ContributionDay =
  ContributionCalendar["weeks"][number]["contributionDays"][number];

// Keep the TTL short, so changes made by the user appear quickly. Most cache refreshes happen through explicit `invalidatePattern()` calls after writes; the TTL is simply a fallback in case one is missed.

const DASHBOARD_CACHE_TTL_SECONDS = getCacheTtlConfig().dashboardSeconds;

// Populate the dashboard's summary metrics. Fail gracefully by returning zeros instead of preventing the entire dashboard from rendering.

export const getDashboardStats = async () => {
  try {
    // Resolve the authenticated user via the shared route guard helper. All activity is scoped to their GitHub account and application data.

    const session = await requireAuthenticated();

    // Dashboard metrics don't need to be recalculated on every request. Cache the aggregated result to reduce GitHub API calls and improve response time.

    return await getOrSet(
      `dash:${session.user.id}:stats`, // unique key for the user dashboard stats

      DASHBOARD_CACHE_TTL_SECONDS,
      async () => {
        // Reuse the user's linked github account to authenticate all github API requests for this dashboard using github access token

        const { octokit, token } = await getAuthenticatedOctokit();

        // Resolve the authenticated GitHub user once, so downstream requests can use the logged in user instead of requiring it from the client.

        const { data: user } = await withGithubCall(
          "users.getAuthenticated",
          (request) => octokit.rest.users.getAuthenticated({ request })
        );

        // Count repositories that the user has connected to the application.

        const totalRepos = await getTotalConnectedRepositories(session.user.id);

        // Fetch contribution data from GitHub's contribution calendar, we only use the total commit count for the dashboard summary.

        const calendar = await fetchUserContributions(token, user.login);

        const totalCommits = calendar?.totalContributions || 0;

        // GitHub's search API returns the total number of pull requests authored by the authenticated user without fetching every result.

        const { data: prs } = await withGithubCall(
          "search.issuesAndPullRequests",
          (request) =>
            octokit.rest.search.issuesAndPullRequests({
              q: `author:${user.login} type:pr`,
              per_page: 1,
              request,
            })
        );

        const totalPrs = prs.total_count;

        // AI reviews are tracked in our database rather than GitHub.

        const totalReviews = await getTotalReviews(session.user.id);

        return {
          totalCommits,
          totalPrs,
          totalReviews,
          totalRepos,
        };
      }
    );
  } catch (error) {
    getLogger().error({ err: error }, "Error fetching dashboard stats");
    return {
      totalCommits: 0,
      totalPrs: 0,
      totalReviews: 0,
      totalRepos: 0,
    };
  }
};

// Builds the dashboard's monthly activity timeline. Commits, pull requests, and AI reviews each come from different sources, so this function merges them into a single month-by-month dataset that the chart can render.

export const getMonthlyActivity = async () => {
  try {
    // Resolve the authenticated user via the shared route guard helper. All activity is scoped to their GitHub account and application data.

    const session = await requireAuthenticated();

    // Cache the aggregated activity timeline to avoid rebuilding it on every dashboard load.

    return await getOrSet(
      `dash:${session.user.id}:monthly-activity`, // unique key for dashboard monthly activity chart

      DASHBOARD_CACHE_TTL_SECONDS,
      async () => {
        // Authenticate GitHub API requests using the user's linked GitHub account.

        const { octokit, token } = await getAuthenticatedOctokit();

        // Resolve the GitHub username once, since subsequent GitHub queries are scoped to the authenticated account.

        const { data: user } = await withGithubCall(
          "users.getAuthenticated",
          (request) => octokit.rest.users.getAuthenticated({ request })
        );

        // GitHub's contribution calendar provides the commit history used for the activity chart.

        const calendar = await fetchUserContributions(token, user.login);

        if (!calendar) {
          return [];
        }

        // Use month names as the common key so commit, pull request, and review counts from different sources can be merged into a single timeline.

        const monthlyData: {
          [key: string]: { commits: number; prs: number; reviews: number };
        } = {};

        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        // Prepopulate (means data is automatically filled) the last six months, so months with no activity still appear in the chart instead of being omitted.

        const now = new Date();

        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthKey = monthNames[date.getMonth()];
          monthlyData[monthKey] = { commits: 0, prs: 0, reviews: 0 };
        }

        // Sum daily contributions into monthly commit totals.

        calendar.weeks.forEach((week) => {
          week.contributionDays.forEach((day: ContributionDay) => {
            if (day.contributionCount > 0) {
              const date = new Date(day.date);
              const monthKey = monthNames[date.getMonth()];

              // Only count contributions from the last 6 months
              if (monthlyData[monthKey]) {
                monthlyData[monthKey].commits += day.contributionCount;
              }
            }
          });
        });

        // Limit GitHub searches to the same six-month window shown in the chart.

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const { data: prs } = await withGithubCall(
          "search.issuesAndPullRequests",
          (request) =>
            octokit.rest.search.issuesAndPullRequests({
              q: `author:${user.login} type:pr created:>${sixMonthsAgo.toISOString().split("T")[0]}`,
              per_page: 100,
              request,
            })
        );

        // GitHub returns individual pull requests, so aggregate them into monthly counts to match the chart's timeline.

        prs.items.forEach((pr) => {
          const date = new Date(pr.created_at);
          const monthKey = monthNames[date.getMonth()];

          if (monthlyData[monthKey]) {
            monthlyData[monthKey].prs += 1;
          }
        });

        // Reviews are tracked in our database rather than GitHub, so merge them into the same monthly dataset.

        const reviewsTrend = await getReviewsTrend(session.user.id);

        // Distribute reviews by month
        reviewsTrend.forEach((trend) => {
          if (monthlyData[trend.month]) {
            monthlyData[trend.month].reviews = trend.reviews;
          }
        });

        // Convert the merged activity map into the ordered structure expected by the dashboard chart in chronological order

        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthKey = monthNames[date.getMonth()];

          if (monthlyData[monthKey]) {
            last6Months.push({
              name: monthKey,
              ...monthlyData[monthKey],
            });
          }
        }

        return last6Months;
      }
    );
  } catch (error) {
    getLogger().error({ err: error }, "Error fetching monthly activity");
    return [];
  }
};

// Build the contribution heatmap directly from GitHub's daily contribution calendar. Each cell reflects actual activity reported by GitHub - no values are estimated or generated locally.

export const getContributionCalendar = async () => {
  try {
    // Resolve the authenticated user via the shared route guard helper. The contribution calendar is specific to the signed-in user's GitHub account.

    const session = await requireAuthenticated();

    // Cache the contribution calendar to avoid repeatedly fetching the same data from GitHub on every dashboard load.

    return await getOrSet(
      `dash:${session.user.id}:contribution-calendar`, // unique key for contribution calendar

      DASHBOARD_CACHE_TTL_SECONDS,
      async () => {
        // Authenticate GitHub API requests using the user's linked GitHub account.

        const { octokit, token } = await getAuthenticatedOctokit();

        // Resolve the GitHub username once since the contribution query is scoped to the authenticated user.

        const { data: user } = await withGithubCall(
          "users.getAuthenticated",
          (request) => octokit.rest.users.getAuthenticated({ request })
        );

        // Fetch GitHub's contribution calendar, which already includes day-by-day contribution counts for the heatmap.

        const calendar = await fetchUserContributions(token, user.login);

        if (!calendar) {
          return { weeks: [], totalContributions: 0 };
        }

        // Reshape GitHub's response into the simpler structure expected by the frontend while preserving the original contribution data.

        return {
          weeks: calendar.weeks.map((week) => ({
            contributionDays: week.contributionDays.map(
              (day: ContributionDay) => ({
                date:
                  typeof day.date === "string"
                    ? day.date
                    : day.date.toISOString().split("T")[0],
                count: day.contributionCount,
              })
            ),
          })),
          totalContributions: calendar.totalContributions,
        };
      }
    );
  } catch (error) {
    getLogger().error({ err: error }, "Error fetching contribution calendar");

    // Return an empty calendar if the data can't be fetched so the dashboard can still render without failing.
    return { weeks: [], totalContributions: 0 };
  }
};
