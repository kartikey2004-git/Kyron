"use server";

import prisma from "@/server/db/client";
import { getOrSet } from "@/server/cache/cache";
import { getCacheTtlConfig } from "@/config/cache-ttl";
import { requireAuthenticated } from "@/features/auth";

/*

  Read-only access to a user's AI PR review history.

    - Reviews are generated asynchronously after a pull request is processed in bckground and stored in the database. 
    
    - simply retrieves those persisted reviews for display in the dashboard and review history pages, it never creates or updates review records itself.

*/

// The review history changes infrequently, so cache it briefly to reduce repeated database queries while users browse the dashboard.

const DASHBOARD_CACHE_TTL_SECONDS = getCacheTtlConfig().reviewSeconds;

// Returns the user's most recent AI reviews, which powers the review history shown in the dashboard, where recent activity is more useful than the complete lifetime history.

export const getReviews = async () => {
  // Resolve the authenticated user via the shared route guard helper. Reviews are always scoped to the repositories owned by the current account.

  const session = await requireAuthenticated();

  return getOrSet(
    `dash:${session.user.id}:reviews`, // unique key for the cache to store the reviews

    DASHBOARD_CACHE_TTL_SECONDS,
    () =>
      // Fetch reviews belonging to repositories owned by the current user also including the repository data allows the UI to display repository details alongside each review without additional database queries.

      prisma.review.findMany({
        where: {
          repository: {
            userId: session.user.id,
          },
        },
        include: {
          repository: true,
        },
        orderBy: {
          createdAt: "desc", // Show the newest reviews first since this data is presented as a recent activity feed.
        },
        take: 50, // Only return the latest 50 reviews. Older reviews remain in the database and can be retrieved later if pagination or archival views are introduced.
      })
  );
};
