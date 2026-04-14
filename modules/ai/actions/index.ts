"use server";

import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { getPullRequestDiff } from "@/modules/github/lib/github";

/*

- Server action to trigger PR review via Inngest
  
  - action is called through webhook when requested to review a PR

  - validates the repository and user, then sends a request to Inngest

  - actual review generation happens in the Inngest function (pr.review.requested)

  - action is idempotent - calling it multiple times will not create duplicate reviews

  - If a review already exists for this PR, it will be updated with the latest changes

*/

export async function reviewPullRequest(
  owner: string,
  repo: string,
  prNumber: number,
) {
  try {
    // Find the repository where the owner and repo match and the user has a github account

    const repository = await prisma.repository.findFirst({
      where: {
        owner,
        name: repo,
      },
      include: {
        user: {
          include: {
            accounts: {
              where: {
                providerId: "github",
              },
            },
          },
        },
      },
    });

    if (!repository) {
      throw new Error(
        `Repository ${owner}/${repo} not found in our database. Please reconnect the repository in your settings.`,
      );
    }

    // Find the github account for the user

    const githubAccount = repository.user.accounts[0];

    if (!githubAccount) {
      throw new Error(
        `No GitHub account found for user. Please reconnect your GitHub account in your settings.`,
      );
    }

    // Get the github accessToken

    const token = githubAccount.accessToken;

    if (!token) {
      throw new Error("GitHub token not found");
    }

    // Get the pull request diff and metadata
    const { diff, title, description } = await getPullRequestDiff(
      token,
      owner,
      repo,
      prNumber,
    );

    // Send the review request to inngest
    await inngest.send({
      name: "pr.review.requested",
      data: {
        owner: owner,
        repo: repo,
        prNumber: prNumber,
        userId: repository.user.id,
      },
    });

    return { success: true, message: "Review request sent successfully" };
  } catch (error) {
    try {
      const repository = await prisma.repository.findFirst({
        where: {
          owner,
          name: repo,
        },
      });

      if (!repository) {
        throw new Error(
          `Repository ${owner}/${repo} not found in our database. Please reconnect the repository in your settings.`,
        );
      }

      if (repository) {
        await prisma.review.create({
          data: {
            repositoryId: repository.id,
            prNumber: prNumber,
            prTitle: "Failed to fetch PR",
            prUrl: `https://github.com/${owner}/${repo}/pull/${prNumber}`,
            review: `Failed to fetch PR and generate review: ${error instanceof Error ? error.message : "Unknown error"}`,
            status: "failed",
          },
        });
      }

    } catch (dbError) {
      console.error("Failed to create failed review record:", dbError);
    }

    // Return the original error message
    return { success: false, message: "Failed to send review request" };
  }
}
