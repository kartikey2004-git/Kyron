"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { getUserRepositories } from "@/modules/github/lib/github";
import { headers } from "next/headers";

export const fetchUserRepositories = async (
  page: number = 1,
  perPage: number = 10,
) => {
  // Get the session from the request headers by calling the auth api

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("User not authenticated");
  }

  // Fetch repositories from GitHub API
  const githubRepos = await getUserRepositories(page, perPage);

  // Fetch connected repositories from database
  const dbRepos = await prisma.repository.findMany({
    where: {
      userId: session.user.id,
    },
  });

  // Create a set of connected repository IDs for efficient lookup

  const connectedRepoIds = new Set(dbRepos.map((repo) => repo.githubId));

  // Add isConnected flag to each repository
  const result = githubRepos.map((repo) => ({
    ...repo,
    isConnected: connectedRepoIds.has(BigInt(repo.id)),
  }));

  return result;
};
