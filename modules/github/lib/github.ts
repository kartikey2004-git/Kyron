import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { getLogger } from "@/lib/logger";
import { getOrSet, hashKey } from "@/lib/cache";
import { githubApiCallDuration, githubApiErrors } from "@/lib/metrics";
import { withSpan } from "@/lib/tracing";
import { headers } from "next/headers";
import { Octokit } from "octokit";

// GitHub content changes fast enough that anything longer risks staleness,
// but rarely enough that this still meaningfully cuts rate-limit pressure
// on the endpoints users actually hammer (dashboard load, repo picker).
const GITHUB_CACHE_TTL_SECONDS = 60;

// No outbound GitHub call in this file had a timeout before this — a
// slow/hung response would hang indexRepository/generateReview
// indefinitely, bounded only by Inngest's own much longer function-level
// timeout. withGithubCall hands every call site a fresh AbortSignal (see
// below) rather than each of the ~10 call sites remembering to build its
// own — one to forget is all it takes to reopen this gap.
const GITHUB_REQUEST_TIMEOUT_MS = 15_000;

function getOctokitStatus(error: unknown): number | undefined {
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = (error as { status?: unknown }).status;
    return typeof status === "number" ? status : undefined;
  }
  return undefined;
}

// Wraps a single outbound GitHub API call: records
// github_api_call_duration_seconds / github_api_errors_total (labeled with
// a fixed, bounded `endpoint` name — never a raw URL), logs the outcome,
// and enforces GITHUB_REQUEST_TIMEOUT_MS via the AbortSignal passed to fn.
async function withGithubCall<T>(
  endpoint: string,
  fn: (request: { signal: AbortSignal }) => Promise<T>
): Promise<T> {
  return withSpan(
    `github.${endpoint}`,
    async () => {
      const logger = getLogger({ endpoint });
      const stopTimer = githubApiCallDuration.startTimer({ endpoint });
      const startedAt = Date.now();

      try {
        const result = await fn({
          signal: AbortSignal.timeout(GITHUB_REQUEST_TIMEOUT_MS),
        });
        logger.info(
          { durationMs: Date.now() - startedAt },
          "github api call succeeded"
        );
        return result;
      } catch (error) {
        const status = getOctokitStatus(error);
        githubApiErrors
          .labels({
            endpoint,
            status_code: status ? String(status) : "unknown",
          })
          .inc();
        logger.error(
          {
            status,
            durationMs: Date.now() - startedAt,
            err: error instanceof Error ? error.message : String(error),
          },
          "github api call failed"
        );
        throw error;
      } finally {
        stopTimer();
      }
    },
    { "github.endpoint": endpoint }
  );
}

// Getting the github access token
export const getGithubAccessToken = async () => {
  // Get the session from the request headers by calling the auth api

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("User not authenticated");
  }

  // Find the github account for the user ( maybe user can connect multiple accounts )

  const account = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      providerId: "github",
    },
  });

  if (!account) {
    throw new Error("GitHub account not found");
  }

  if (!account?.accessToken) {
    throw new Error("GitHub access token not found");
  }

  return account.accessToken;
};

interface ContributionData {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: number;
        weeks: {
          contributionDays: {
            contributionCount: number;
            date: string | Date;
            color: string;
          }[];
        }[];
      };
    };
  };
}

// Fetching user contributions
export const fetchUserContributions = async (
  token: string,
  username: string,
) => {
  return getOrSet(
    `github:contributions:${hashKey(token)}:${username}`,
    GITHUB_CACHE_TTL_SECONDS,
    async () => {
      // Using octokit to fetch user contributions
      const octokit = new Octokit({ auth: token });

      // GraphQL query to fetch user contributions
      const query = `
    query ($username: String!) {
        user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                color
              }
            }
          }
        }
      }
    }
  `;

      const response = await withGithubCall("graphql.contributions", (request) =>
        octokit.graphql<ContributionData>(query, { username, request })
      );

      return response.user.contributionsCollection.contributionCalendar;
    }
  );
};

// Fetching user both public and private repositories with pagination
export const getUserRepositories = async (
  page: number = 1,
  perPage: number = 10,
) => {
  // Getting the github access token and constructing octokit instance

  const token = await getGithubAccessToken();

  return getOrSet(
    `github:repos:list:${hashKey(token)}:${page}:${perPage}`,
    GITHUB_CACHE_TTL_SECONDS,
    async () => {
      const octokit = new Octokit({ auth: token });

      const { data } = await withGithubCall(
        "repos.listForAuthenticatedUser",
        (request) =>
          octokit.rest.repos.listForAuthenticatedUser({
            sort: "updated",
            direction: "desc",
            visibility: "all",
            page: page,
            per_page: perPage,
            request,
          })
      );

      return data;
    }
  );
};

// Creating webhook for a repository : for pull request events
export const createWebhook = async (owner: string, repo: string) => {
  const token = await getGithubAccessToken();
  const octokit = new Octokit({ auth: token });

  const webhookUrl = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/webhooks/github`;

  const { data: webhooks } = await withGithubCall("repos.listWebhooks", (request) =>
    octokit.rest.repos.listWebhooks({ owner, repo, request })
  );

  const existingWebhook = webhooks.find(
    (webhook) => webhook.config.url === webhookUrl,
  );

  if (existingWebhook) {
    return existingWebhook;
  }

  const { data: newWebhook } = await withGithubCall(
    "repos.createWebhook",
    (request) =>
      octokit.rest.repos.createWebhook({
        owner,
        repo,
        config: {
          url: webhookUrl,
          content_type: "json",
        },
        events: ["pull_request"],
        request,
      })
  );

  return newWebhook;
};

export const deleteWebhook = async (owner: string, repo: string) => {
  // Getting the github access token and constructing octokit instance

  const token = await getGithubAccessToken();
  const octokit = new Octokit({ auth: token });

  // Creating the webhook URL
  const webhookUrl = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/webhooks/github`;

  // Listing existing webhooks to check if our webhook already exists and delete it

  const { data: webhooks } = await withGithubCall("repos.listWebhooks", (request) =>
    octokit.rest.repos.listWebhooks({ owner, repo, request })
  );

  const existingWebhook = webhooks.find(
    (webhook) => webhook.config.url === webhookUrl,
  );

  if (existingWebhook) {
    await withGithubCall("repos.deleteWebhook", (request) =>
      octokit.rest.repos.deleteWebhook({
        owner,
        repo,
        hook_id: existingWebhook.id,
        request,
      })
    );

    return true;
  }

  return false;
};

export const getRepoFileContent = async (
  token: string,
  owner: string,
  repo: string,
  path: string = "",
): Promise<{ path: string; content: string }[]> => {
  return getOrSet(
    `github:${owner}/${repo}:content:${path || "root"}`,
    GITHUB_CACHE_TTL_SECONDS,
    () => fetchRepoFileContent(token, owner, repo, path)
  );
};

async function fetchRepoFileContent(
  token: string,
  owner: string,
  repo: string,
  path: string,
): Promise<{ path: string; content: string }[]> {
  const octokit = new Octokit({ auth: token });

  const { data } = await withGithubCall("repos.getContent", (request) =>
    octokit.rest.repos.getContent({ owner, repo, path, request })
  );

  if (!Array.isArray(data)) {
    if (data.type === "file" && data.content) {
      return [
        {
          path: data.path,
          content: Buffer.from(data.content, "base64").toString("utf-8"),
        },
      ];
    }
    return [];
  }

  let files: { path: string; content: string }[] = [];

  for (const item of data) {
    if (item.type === "file") {
      const { data: fileData } = await withGithubCall("repos.getContent", (request) =>
        octokit.rest.repos.getContent({ owner, repo, path: item.path, request })
      );

      if (
        !Array.isArray(fileData) &&
        fileData.type === "file" &&
        fileData.content
      ) {
        if (!item.path.match(/\.(png|jpg|jpeg|gif|svg|ico|pdf|zip|tar|gz)$/i)) {
          files.push({
            path: fileData.path,
            content: Buffer.from(fileData.content, "base64").toString("utf-8"),
          });
        }
      }
    } else if (item.type === "dir") {
      // Goes back through getRepoFileContent (not this function directly)
      // so each subdirectory is cached independently too.
      const subFiles = await getRepoFileContent(token, owner, repo, item.path);
      files = files.concat(subFiles);
    }
  }

  return files;
}

// Get pull request diff and metadata
export const getPullRequestDiff = async (
  token: string,
  owner: string,
  repo: string,
  prNumber: number,
) => {
  return getOrSet(
    `github:${owner}/${repo}:pr:${prNumber}:diff`,
    GITHUB_CACHE_TTL_SECONDS,
    async () => {
      const octokit = new Octokit({ auth: token });

      const { data: pr } = await withGithubCall("pulls.get", (request) =>
        octokit.rest.pulls.get({
          owner,
          repo,
          pull_number: prNumber,
          request,
        })
      );

      const { data: diff } = await withGithubCall("pulls.get_diff", (request) =>
        octokit.rest.pulls.get({
          owner,
          repo,
          pull_number: prNumber,
          mediaType: {
            format: "diff",
          },
          request,
        })
      );

      return {
        diff: diff as unknown as string,
        title: pr.title,
        description: pr.body || "",
      };
    }
  );
};

// Post a review comment on a pull request
export const postReviewComment = async (
  token: string,
  owner: string,
  repo: string,
  prNumber: number,
  review: string,
) => {
  const octokit = new Octokit({ auth: token });

  await withGithubCall("issues.createComment", (request) =>
    octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body: `**AI Code Review by CodeSense AI**\n\n${review}\n\n---\n\n*This review was generated by an AI assistant. Please review the feedback before merging.*`,
      request,
    })
  );
};
