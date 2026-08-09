"use server";

import { inngest } from "@/server/inngest/client";
import prisma from "@/server/db/client";
import { getLogger } from "@/server/observability/logger";
import { MAX_DIFF_CHARS, truncateForPrompt } from "@/server/ai/prompt-budget";
import { decryptToken } from "@/server/security/token-encryption";
import { getPullRequestDiff } from "@/server/github/client";

/*

Server action that triggers an AI code review for a pull request.

  - It handles requests for a pull request review whether it's a GitHub webhook or a manual re-run triggered/retry from the dashboard. 
  
    - We have asynchronous review pipeline means we don't generate the review immediately after the request. Instead, we enqueue (add that request to queue) an Inngest job to generate the review in the background.
    
    - The job is deliberately simple
    
      1. Start by identifying which repository this request belongs to and who owns it in our system. From there, we use the owner's linked GitHub account to authenticate the request. The linked account provides the access token needed to fetch the pull request diff.
      
      2. Decrypt the GitHub access token, fetch the pull request diff, and enqueue an Inngest job. Heavy work such as AI analysis and review generation happens later in the background.


  - Keeping this path lightweight ensures webhook requests return response quickly instead of waiting on expensive operations like LLM inference/reasoning.

  - It only does the cheap synchronous work (look up the repo + user, decrypt the stored GitHub token, fetch the PR diff) and then hands off to Inngest, so a webhook handler that GitHub expects to acknowledge quickly, never blocks on the Gemini call.
  
  - The real review generation lives in the Inngest function for `pr.review.requested`. The Review table is an append-only activity log, not one row per PR
     
    - An append-only activity log is a database row where new action records are added only to the end. Existing entries cannot be changed or deleted. This creates a permanent, unchangeable timeline of events

  -  Only one review for a pull request is allowed to run at a time. Additional requests wait until the current review has finished.

*/

export async function reviewPullRequest(
  owner: string,
  repo: string,
  prNumber: number,
  deliveryId?: string | null
) {
  try {
    // Find the repository referenced by the incoming owner/repository pair and get the owning user together with their linked GitHub account. The linked account provides the credentials(access token) needed for GitHub API requests.

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

    // If the repository is not found, throw an error

    if (!repository) {
      throw new Error(
        `Repository ${owner}/${repo} not found in our database. Please reconnect the repository in your settings.`
      );
    }

    // Every tracked repository in our app should have a linked GitHub account for its owner. Without one, we can't authenticate GitHub API requests.

    const githubAccount = repository.user.accounts[0];

    // If the GitHub account is not found, throw an error

    if (!githubAccount) {
      throw new Error(
        `No GitHub account found for user. Please reconnect your GitHub account in your settings.`
      );
    }

    // Decrypt the stored GitHub access token before making API requests.

    const token = githubAccount.accessToken
      ? decryptToken(githubAccount.accessToken)
      : null;

    // If the token is not found, throw an error

    if (!token) {
      throw new Error("GitHub token not found");
    }

    // Fetch the pull request metadata and diff once, so downstream workers don't repeat the same GitHub API request for the same PR. The diff is trimmed to stay within the prompt and event payload size limits.

    const {
      diff: rawDiff,
      title,
      description,
    } = await getPullRequestDiff(token, owner, repo, prNumber);

    const diff = truncateForPrompt(rawDiff, MAX_DIFF_CHARS, "the PR diff");

    /*
    
      - Hand the review request offload to Inngest for asynchronous processing.

          - GitHub assigns a unique identifier to every webhook delivery. It's sent in the X-GitHub-Delivery HTTP header.
        
          - We reuse that identifier as the particular Inngest event ID, so if GitHub retries or redelivers the same webhook, Inngest processes it only once.

          - New webhook events (such as a later push or PR update) receive a different github delivery ID and are handled independently.


      - Using the GitHub delivery ID as the event ID allows Inngest to ignore duplicate webhook deliveries within its deduplication window while still processing the future events for the same PR.(e.g. a follow-up "synchronize")
    
    */

    await inngest.send({
      ...(deliveryId ? { id: `github-delivery:${deliveryId}` } : {}),
      name: "pr.review.requested", // event name
      data: {
        owner: owner,
        repo: repo,
        prNumber: prNumber,
        userId: repository.user.id,
        diff,
        title,
        description,
      },
    });

    return { success: true, message: "Review request sent successfully" };
  } catch (error) {
    // If the review request fails, create a review with a failed status. This is a fallback to ensure a review record exists even when the asyncronous job fails.

    try {
      // Find the repository referenced by the incoming owner/repository pair

      const repository = await prisma.repository.findFirst({
        where: {
          owner,
          name: repo,
        },
      });

      // If the repository is not found, throw an error

      if (!repository) {
        throw new Error(
          `Repository ${owner}/${repo} not found in our database. Please reconnect the repository in your settings.`
        );
      }

      // Create a review of the PR with a failed status

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
      getLogger().error(
        { err: dbError, owner, repo, prNumber },
        "Failed to create failed review record"
      );
    }

    // Return the original error message
    return { success: false, message: "Failed to send review request" };
  }
}
