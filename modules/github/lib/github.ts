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
