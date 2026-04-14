import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { Octokit } from "octokit";

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

// Fetching user contributions
export const fetchUserContributions = async (
  token: string,
  username: string,
) => {
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

  interface contributionData {
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

  try {
    const response: contributionData = await octokit.graphql(query, {
      username,
    });

    return response.user.contributionsCollection.contributionCalendar;
  } catch (error) {
    console.error("Error fetching user contributions:", error);
    throw error;
  }
};

// Fetching user both public and private repositories with pagination
export const getUserRepositories = async (
  page: number = 1,
  perPage: number = 10,
) => {
  // Getting the github access token and constructing octokit instance

  const token = await getGithubAccessToken();
  const octokit = new Octokit({ auth: token });

  try {
    const { data } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: "updated",
      direction: "desc",
      visibility: "all",
      page: page,
      per_page: perPage,
    });

    return data;
  } catch (error) {
    console.error("Error fetching user repositories:", error);
    throw error;
  }
};

// Creating webhook for a repository : for pull request events
export const createWebhook = async (owner: string, repo: string) => {
  const token = await getGithubAccessToken();
  const octokit = new Octokit({ auth: token });

  const webhookUrl = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/webhooks/github`;

  try {
    const { data: webhooks } = await octokit.rest.repos.listWebhooks({
      owner,
      repo,
    });

    const existingWebhook = webhooks.find(
      (webhook) => webhook.config.url === webhookUrl,
    );

    if (existingWebhook) {
      return existingWebhook;
    }

    const { data: newWebhook } = await octokit.rest.repos.createWebhook({
      owner,
      repo,
      config: {
        url: webhookUrl,
        content_type: "json",
      },
      events: ["pull_request"],
    });

    return newWebhook;
  } catch (error) {
    console.error("Error creating webhook:", error);
    throw error;
  }
};

export const deleteWebhook = async (owner: string, repo: string) => {
  // Getting the github access token and constructing octokit instance

  const token = await getGithubAccessToken();
  const octokit = new Octokit({ auth: token });

  // Creating the webhook URL
  const webhookUrl = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/webhooks/github`;

  // Listing existing webhooks to check if our webhook already exists and delete it

  try {
    const { data: webhooks } = await octokit.rest.repos.listWebhooks({
      owner,
      repo,
    });

    const existingWebhook = webhooks.find(
      (webhook) => webhook.config.url === webhookUrl,
    );

    if (existingWebhook) {
      await octokit.rest.repos.deleteWebhook({
        owner,
        repo,
        hook_id: existingWebhook.id,
      });

      return true;
    }

    return false;
  } catch (error) {
    console.error("Error deleting webhook:", error);
    throw error;
  }
};

export const getRepoFileContent = async (
  token: string,
  owner: string,
  repo: string,
  path: string = "",
): Promise<{ path: string; content: string }[]> => {
  const octokit = new Octokit({ auth: token });

  const { data } = await octokit.rest.repos.getContent({
    owner,
    repo,
    path,
  });

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
      const { data: fileData } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: item.path,
      });

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
      const subFiles = await getRepoFileContent(token, owner, repo, item.path);
      files = files.concat(subFiles);
    }
  }

  return files;
};

// Get pull request diff and metadata
export const getPullRequestDiff = async (
  token: string,
  owner: string,
  repo: string,
  prNumber: number,
) => {
  const octokit = new Octokit({ auth: token });

  const { data: pr } = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: prNumber,
  });

  const { data: diff } = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: prNumber,
    mediaType: {
      format: "diff",
    },
  });

  return {
    diff: diff as unknown as string,
    title: pr.title,
    description: pr.body || "",
  };
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

  await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: prNumber,
    body: `**AI Code Review by CodeSense AI**\n\n${review}\n\n---\n\n*This review was generated by an AI assistant. Please review the feedback before merging.*`,
  });
};
