"use server";

import { inngest } from "@/inngest/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import {
  createWebhook,
  getUserRepositories,
} from "@/modules/github/lib/github";
import { headers } from "next/headers";

// Fetch user repositories from GitHub API and check which ones are connected to the user
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

export const connectRepository = async (
  owner: string,
  githubId: number,
  repo: string,
) => {
  // Get the session from the request headers by calling the auth api

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("User not authenticated");
  }

  // TODO : RATE LIMIT THE USER OR CHECK IF USER CAN CONNECT MORE REPOS

  const webhook = await createWebhook(owner, repo);

  if (webhook) {
    await prisma.repository.create({
      data: {
        githubId: BigInt(githubId),
        name: repo,
        owner: owner,
        fullName: `${owner}/${repo}`,
        url: `https://github.com/${owner}/${repo}`,
        userId: session.user.id,
      },
    });
  }

  // TODO: INCREMENT THE USER'S REPOSITORY COUNT FOR USAGE TRACKING

  // TRIGGER REPOSITORY INDEXING USING RAG(FIRE AND FORGOT)

  try {
    await inngest.send({
      name: "repository.connected",
      data:{
        owner: owner,
        repo: repo,
        userId: session.user.id
      }
    })
  } catch (error) {
    console.error("Failed to trigger repository indexing")
  }

  return webhook
};
