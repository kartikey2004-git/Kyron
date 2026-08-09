"use server";

import prisma from "@/server/db/client";
import { getLogger } from "@/server/observability/logger";
import { getOrSet, invalidatePattern } from "@/server/cache/cache";
import { deleteWebhook } from "@/server/github/client";
import { getCacheTtlConfig } from "@/config/cache-ttl";
import { revalidatePath } from "next/cache";
import { requireAuthenticated } from "@/features/auth";

/*
  
Server actions for the user settings page.
   
    - Handles profile management and repository management, including loading and updating the user's profile, listing connected repositories, and disconnecting repositories from the application. 
    
    - Repository management also keeps the database, repository count, cache, and GitHub webhooks in sync as repositories are connected or removed.

*/

const MAX_NAME_LENGTH = 100;

// Profile information changes infrequently, so cache it briefly to avoid repeatedly querying the database during normal navigation.

const DASHBOARD_CACHE_TTL_SECONDS = getCacheTtlConfig().settingsSeconds;

// Fetch the authenticated user's profile for the settings page.

export async function getUserProfile() {
  try {
    // Resolve the authenticated user via the shared route guard helper. Profiles are always fetched for the currently signed-in account.

    const session = await requireAuthenticated();

    if (!session.user?.id) {
      throw new Error("User ID not found in session");
    }

    return await getOrSet(
      `dash:${session.user.id}:profile`, // unique key for caching the user profile

      DASHBOARD_CACHE_TTL_SECONDS,
      () =>
        // Fetch only the fields required by the settings page instead of loading the entire user record.

        prisma.user.findUnique({
          where: {
            id: session.user.id,
          },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
            updatedAt: true,
          },
        })
    );
  } catch (error) {
    getLogger().error({ err: error }, "Error fetching user profile");
    throw error;
  }
}

/* 

  Updates the user's profile information.
    
    - Only the display name can be changed here. The email address is managed by GitHub OAuth and isn't editable from the application, we avoiding the need to handle email ownership verification and just keeping the authentication data

*/

export async function updateUserProfile(data: { name?: string }) {
  try {
    // Resolve the authenticated user via the shared route guard helper. Profile updates are always applied to the currently signed-in account.

    const session = await requireAuthenticated();

    if (!session.user?.id) {
      throw new Error("User ID not found in session");
    }

    const name = data.name?.trim();

    if (name !== undefined) {
      if (name.length === 0) {
        throw new Error("Name cannot be empty");
      }

      if (name.length > MAX_NAME_LENGTH) {
        throw new Error(`Name must be ${MAX_NAME_LENGTH} characters or fewer`);
      }
    }

    // Update only the editable profile fields (which is only name) and return the values needed by the settings page.

    // Update the user profile
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // The updated profile may be shown in multiple places. Clear the cached dashboard data, so subsequent requests use the latest values.

    await invalidatePattern(`dash:${session.user.id}:*`);

    // Refresh the current settings page immediately instead of waiting for the next navigation.

    revalidatePath("/dashboard/settings", "page");

    return updatedUser;
  } catch (error) {
    getLogger().error({ err: error }, "Error updating user profile");
    throw error;
  }
}

// Get all repositories connected to the authenticated user's account. This powers the repository management section of the settings page.

export async function getConnectedRepositories() {
  try {
    // Resolve the authenticated user via the shared route guard helper. Connected repositories are always scoped to the currently signed-in account.

    const session = await requireAuthenticated();

    return await getOrSet(
      `dash:${session.user.id}:connected-repos`, // unique key for caching the connected repositories

      DASHBOARD_CACHE_TTL_SECONDS,
      () =>
        // Fetch all the connected repositories linked to this user. Only the fields needed by the settings page are selected to avoid loading unnecessary data, in order where latest added repo will be first

        prisma.repository.findMany({
          where: {
            userId: session.user.id,
          },
          select: {
            id: true,
            name: true,
            fullName: true,
            url: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        })
    );
  } catch (error) {
    getLogger().error({ err: error }, "Error fetching connected repositories");
    return [];
  }
}

// Disconnect a repository from the authenticated user's account. This disconnect the repository from the application, updates the user's connected repository count, and cleans up the associated GitHub webhook.

export async function disconnectRepository(repositoryId: string) {
  try {
    // Resolve the authenticated user via the shared route guard helper.Only repositories owned by the current account can be disconnected.

    const session = await requireAuthenticated();

    // Ensure the repository exists in the database and belongs to the current user before attempting to remove it.

    const repository = await prisma.repository.findUnique({
      where: {
        id: repositoryId,
        userId: session.user.id,
      },
    });

    if (!repository) {
      throw new Error("Repository not found or not connected to this user");
    }

    /*
     
      - Remove the connected repository from the app and update the user's repository count in a single database transaction.

      - This guarantees both changes succeed or fail together, preventing the application from showing inconsistent repository counts.

    */

    const [disconnectedRepository] = await prisma.$transaction([
      prisma.repository.delete({
        where: {
          id: repositoryId,
          userId: session.user.id,
        },
      }),

      // Decrease the connected repository count, but never let it drop below zero because this protects against negative values if the stored counter ever becomes temporarily inconsistent with the actual repository records.

      prisma.$executeRaw`
        UPDATE "user"
        SET "repositoryCount" = GREATEST("repositoryCount" - 1, 0)
        WHERE "id" = ${session.user.id}
      `,
    ]);

    try {
      // The repository has already been removed from the application, so this step simply cleans up the corresponding webhook on GitHub.

      await deleteWebhook(repository.owner, repository.name);
    } catch (error) {
      // Failing to remove the webhook doesn't undo the disconnect. The repository is already disconnected locally from our app and also from the database, so log the webhook deletion failure and continue instead of reporting the entire operation as failed.

      getLogger().warn(
        {
          err: error,
          owner: repository.owner,
          repo: repository.name,
        },
        "failed to delete GitHub webhook after disconnecting repository"
      );
    }

    // The user's connected repositories and dashboard metrics have changed. Clear the cached dashboard data, so future requests return fresh values.

    await invalidatePattern(`dash:${session.user.id}:*`);

    // Refresh pages that display the user's connected repositories.

    revalidatePath("/dashboard/repository", "page");
    revalidatePath("/dashboard/settings", "page");

    return { success: true, repository: disconnectedRepository };
  } catch (error) {
    getLogger().error({ err: error }, "Error disconnecting repository");
    return { success: false, error: "Failed to disconnect repository" };
  }
}

// Disconnect every repository connected to the authenticated user's account. This removes all repository records, resets the connected repository count, and cleans up the corresponding GitHub webhooks.

export async function disconnectAllRepositories() {
  try {
    // Resolve the authenticated user via the shared route guard helper.Only repositories owned by the current account can be disconnected.

    const session = await requireAuthenticated();

    // Find all the connected repositories in deleting before deleting them with their owner/name values are needed later to remove the corresponding GitHub webhooks.

    const repositories = await prisma.repository.findMany({
      where: {
        userId: session.user.id,
      },
    });

    // Remove all repositories and reset the repository counter in a single transaction. This keeps the application's database in a consistent state even if one of the operations fails

    const result = await prisma.$transaction([
      prisma.repository.deleteMany({
        where: {
          userId: session.user.id,
        },
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          repositoryCount: 0,
        },
      }),
    ]);

    // The repositories have already been disconnected locally from the app and also from the database. So clean up each GitHub webhook independently, so one github webhook cleanup failure doesn't prevent the others from being removed.

    const webhookResults = await Promise.allSettled(
      repositories.map((repository) =>
        deleteWebhook(repository.owner, repository.name)
      )
    );

    // Record any webhook cleanup failures for investigation and log the failure. The repositories are already disconnected from the application, so these failures don't affect the overall operation.

    const failedWebhooks = repositories.filter(
      (_, index) => webhookResults[index].status === "rejected"
    );

    if (failedWebhooks.length > 0) {
      getLogger().warn(
        {
          failedCount: failedWebhooks.length,
          totalCount: repositories.length,
          repos: failedWebhooks.map((r) => r.fullName),
        },
        "some GitHub webhooks failed to delete after disconnecting all repositories"
      );
    }

    // Repository management and dashboard data have changed, so clear the cached dashboard entries.

    await invalidatePattern(`dash:${session.user.id}:*`);

    // Refresh pages that display connected repositories.

    revalidatePath("/dashboard/repository", "page");
    revalidatePath("/dashboard/settings", "page");

    return {
      success: true,
      count: result[0].count,
      webhookCleanupFailures: failedWebhooks.length,
    };
  } catch (error) {
    getLogger().error({ err: error }, "Error disconnecting all repositories");
    return { success: false, error: "Failed to disconnect repositories" };
  }
}
