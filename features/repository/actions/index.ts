"use server";

import { inngest } from "@/server/inngest/client";
import prisma from "@/server/db/client";
import { getLogger } from "@/server/observability/logger";
import { getOrSet, invalidatePattern } from "@/server/cache/cache";
import {
  createWebhook,
  deleteWebhook,
  getUserRepositories,
} from "@/server/github/client";
import { getCacheTtlConfig } from "@/config/cache-ttl";
import { requireAuthenticated } from "@/features/auth";

/*
 
  Server actions for connecting repositories to the application.
 
    - repository onboarding process from listing a user's GitHub repositories to configuring webhooks, storing the connection, and starting the initial indexing required by the rest of the application.
 
*/

const DASHBOARD_CACHE_TTL_SECONDS = getCacheTtlConfig().repositorySeconds;

/*
  
  Returns the authenticated user's GitHub repositories along with their connection status in the application.
 
    - Repository details come from GitHub, while the connection status is derived from our database. 
    
    - Combining both sources here lets the UI render each repository's current state with a single request.

*/

export const fetchUserRepositories = async (
  page: number = 1,
  perPage: number = 10
) => {
  // Resolve the authenticated user via the shared route guard helper. Connected repositories are scoped to the current account.

  const session = await requireAuthenticated();

  // Cache the merged repository list with connection status to avoid repeatedly fetching the same GitHub and database data during normal navigation.

  return getOrSet(
    `dash:${session.user.id}:repos:${page}:${perPage}`, // unique key for the caching the data of this user and perPage repositories

    DASHBOARD_CACHE_TTL_SECONDS,
    async () => {
      // Fetch the user's repositories from GitHub.

      const githubRepos = await getUserRepositories(page, perPage);

      // Fetch the repositories this user has already connected to the application.

      const dbRepos = await prisma.repository.findMany({
        where: {
          userId: session.user.id,
        },
      });

      // Build a Set (data structure for holding unique values) containing the IDs of repositories already connected to this account.

      // As we iterate through the GitHub repositories, we can determine whether each one is connected with a fast lookup instead of repeatedly scanning the database results.

      const connectedRepoIds = new Set(dbRepos.map((repo) => repo.githubId));

      // Merge GitHub data with our connection state so each repository carries an `isConnected` flag that the UI can render directly.

      const result = githubRepos.map((repo) => ({
        ...repo,
        isConnected: connectedRepoIds.has(BigInt(repo.id)),
      }));

      return result;
    }
  );
};

// Connects a GitHub repository to the application by creating a webhook and storing the connection in the database.

export const connectRepository = async (
  owner: string,
  githubId: number,
  repo: string
) => {
  // Resolve the authenticated user via the shared route guard helper. The connected repository will be owned by this account and count against its repository limit.

  const session = await requireAuthenticated();

  // Fetch the user's subscription and current repository count to determine how many repositories they're allowed to connect.

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  });

  if (!user) throw new Error("User not found");

  const plan = user.subscription?.plan || "free";

  const MAX_REPOS: Record<string, number> = {
    free: 1, // Free plan allows 1 repository
    pro: 5, // Pro plan allows 5 repositories
    enterprise: 50, // Enterprise plan allows 50 repositories
  };

  const limit = MAX_REPOS[plan] || 0;

  const LIMIT_REACHED_MESSAGE =
    "Repository limit reached. Upgrade your plan to connect more repositories.";

  /*
  
    - Fail fast when the user is already at their repository limit. This avoids making unnecessary GitHub API calls, but it isn't the final enforcement.

    - This is not what actually enforces the limit: two concurrent calls could both read repositoryCount before either commits, both pass this check and both succeed. The conditional UPDATE below is the real enforcement, atomic at the database level.
    
    - The database transaction below performs the real atomic limit check, Perform the limit check and increment counter in a single database operation (atomic transaction). If two requests try to connect repositories at the same time, only one can increment the counter once the limit is reached, preventing the user from exceeding their subscription limit.
  
  */

  if (user.repositoryCount >= limit) {
    throw new Error(LIMIT_REACHED_MESSAGE);
  }

  // Register (or refresh) the GitHub webhook, so pull request events start flowing into the application as soon as the repository is connected.

  const webhook = await createWebhook(owner, repo);

  if (webhook) {
    try {
      await prisma.$transaction(async (tx) => {
        /*
            
          -  Atomically increment the repository count only if the user is still below their plan's limit. At the plan's limit this row is locked/updated and the query returns an empty result.
          
          - This prevents cotncurrent requests from connecting more repositories than the subscription allows. 
        
        */
        const updated = await tx.$queryRaw<{ repositoryCount: number }[]>`
          UPDATE "user"
          SET "repositoryCount" = "repositoryCount" + 1
          WHERE "id" = ${session.user.id} AND "repositoryCount" < ${limit}
          RETURNING "repositoryCount"
        `;

        if (updated.length === 0) {
          throw new Error(LIMIT_REACHED_MESSAGE);
        }

        // Persist the repository so the application can track it and respond to future webhook events.

        await tx.repository.create({
          data: {
            githubId: BigInt(githubId),
            name: repo,
            owner: owner,
            fullName: `${owner}/${repo}`,
            url: `https://github.com/${owner}/${repo}`,
            userId: session.user.id,
          },
        });
      });
    } catch (error) {
      /*
      
        - Webhook creation happens before we know the database transaction will succeed.
        
        - If the transaction is later rejected such as when another concurrent request consumes the last available repository slot, we clean up the webhook to avoid leaving GitHub configured to send events for a repository that was never successfully connected.
      
      */

      await deleteWebhook(owner, repo).catch((cleanupError) => {
        getLogger().error(
          { err: cleanupError, owner, repo },
          "Failed to clean up webhook after rejected repository connect"
        );
      });
      throw error;
    }

    // The user's connected repositories have changed. Clear the cached dashboard data, so the next request reflects the latest state.

    await invalidatePattern(`dash:${session.user.id}:*`);
  }

  // Fire-and-Forget: Start indexing the repository in the background. Connecting a repository should complete immediately, so indexing happens asynchronously with background workers in inngest and doesn't block the user's request.

  try {
    await inngest.send({
      name: "repository.connected",
      data: {
        owner: owner,
        repo: repo,
        userId: session.user.id,
      },
    });
  } catch (error) {
    getLogger().error(
      { err: error, owner, repo },
      "Failed to trigger repository indexing"
    );
  }

  return webhook;
};
