"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import {
  fetchUserContributions,
  getGithubAccessToken,
} from "@/modules/github/lib/github";
import { headers } from "next/headers";
import { Octokit } from "octokit";

export const getDashboardStats = async () => {
  try {
    // Get the session from the request headers by calling the auth api

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("User not authenticated");
    }

    // Get the github access token and configure octokit

    const token = await getGithubAccessToken();
    const octokit = new Octokit({ auth: token });

    // Get the authenticated gitHub user data

    const { data: user } = await octokit.rest.users.getAuthenticated();

    // TODO : FETCH TOTAL CONNECTED REPO FROM DB

    const totalRepos = 30;

    // fetch the contribution stats for authenticated user : commits and pull requests

    const calendar = await fetchUserContributions(token, user.login);

    const totalCommits = calendar?.totalContributions || 0;

    // Count all the pr's from database and github

    const { data: prs } = await octokit.rest.search.issuesAndPullRequests({
      q: `author:${user.login} type:pr`,
      per_page: 1,
    });

    const totalPrs = prs.total_count;

    // TODO : COUNT AI REVIEWS FROM DATABASE

    const totalReviews = 44;

    return {
      totalCommits,
      totalPrs,
      totalReviews,
      totalRepos,
    };
  } catch (error) {
    console.log("Error fetching dashboard stats:", error);
    return {
      totalCommits: 0,
      totalPrs: 0,
      totalReviews: 0,
      totalRepos: 0,
    };
  }
};

export const getMonthlyActivity = async () => {
  try {
    // Get the session from the request headers by calling the auth api

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("User not authenticated");
    }

    // Get the github access token and configure octokit

    const token = await getGithubAccessToken();
    const octokit = new Octokit({ auth: token });

    // Fetches github username of autheticated user

    const { data: user } = await octokit.rest.users.getAuthenticated();

    // Fetches contribution stats of autheticated user : commits and pull requests from the last year

    // Gets your contribution calendar

    const calendar = await fetchUserContributions(token, user.login);

    if (!calendar) {
      return [];
    }

    // aggregate grouping of contributions data by month containing pr , commits , no of reviews

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

    // Initialize last 6 months and count how many contribution user made each month

    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      const monthKey = monthNames[date.getMonth()];
      monthlyData[monthKey] = { commits: 0, prs: 0, reviews: 0 };
    }

    calendar.weeks.forEach((week: any) => {
      week.contributionDays.forEach((day: any) => {
        const date = new Date(day.date);
        const monthKey = monthNames[date.getMonth()];

        if (monthlyData[monthKey]) {
          monthlyData[monthKey].commits += day.contributionCount;
        }
      });
    });

    // Fetch reviews from database for last 6 months

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // TODO : REVIEWS REAL DATA

    // Generating sample code reviews

    const generateSampleReviews = () => {
      const sampleReviews = [];
      const now = new Date();

      // Generate random reviews  over past 6 months

      for (let i = 0; i < 45; i++) {
        const randomDaysAgo = Math.floor(Math.random() * 180); // Random day in last 6 months

        const reviewDate = new Date(now);
        reviewDate.setDate(reviewDate.getDate() - randomDaysAgo);

        sampleReviews.push({
          createdAt: reviewDate,
        });
      }

      return sampleReviews;
    };

    const reviews = generateSampleReviews();

    reviews.forEach((review) => {
      const monthKey = monthNames[review.createdAt.getMonth()];

      if (monthlyData[monthKey]) {
        monthlyData[monthKey].prs += 1;
      }
    });

    // Fetches all the pull requests in last 6 months 

    const { data: prs } = await octokit.rest.search.issuesAndPullRequests({
      q: `author:${user.login} type:pr created:>${sixMonthsAgo.toISOString().split("T")[0]}`,
      per_page: 100,
    });

    // counts the number of pull requests by the user per month

    prs.items.forEach((pr: any) => {
      const date = new Date(pr.created_at);
      const monthKey = monthNames[date.getMonth()];

      if (monthlyData[monthKey]) {
        monthlyData[monthKey].prs += 1;
      }
    });

    return Object.keys(monthlyData).map((name) => ({
      name,
      ...monthlyData[name],
    }));
  } catch (error) {
    console.error("Error fetching monthly activity:", error);
    return [];
  }
};
