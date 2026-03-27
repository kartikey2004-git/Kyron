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

