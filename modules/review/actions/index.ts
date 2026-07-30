"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { getOrSet } from "@/lib/cache";
import { headers } from "next/headers";

const DASHBOARD_CACHE_TTL_SECONDS = 30;

export const getReviews = async () => {
  // Get the session from the request headers by calling the auth api
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("User not authenticated");
  }

  return getOrSet(
    `dash:${session.user.id}:reviews`,
    DASHBOARD_CACHE_TTL_SECONDS,
    () =>
      // Find reviews for repositories owned by the current user
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
          createdAt: "desc",
        },
        take: 50,
      })
  );
};
