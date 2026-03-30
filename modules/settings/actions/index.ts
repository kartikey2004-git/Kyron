"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { deleteWebhook } from "@/modules/github/lib/github";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

// Get user profile
export async function getUserProfile() {
  try {
    // Get the session from the request headers by calling the auth api

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("User not authenticated");
    }

    if (!session.user?.id) {
      throw new Error("User ID not found in session");
    }

    // Find the user from the database by ID
    const user = await prisma.user.findUnique({
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
    });

    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

// Update user profile
export async function updateUserProfile(data: {
  name?: string;
  email?: string;
}) {
  try {
    // Get the session from the request headers by calling the auth api

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("User not authenticated");
    }

    if (!session.user?.id) {
      throw new Error("User ID not found in session");
    }

    // Update the user profile
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: data.name,
        email: data.email,
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

    // Revalidate the settings page to show the updated profile

    revalidatePath("/dashboard/settings", "page");

    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

// Get all the connected repositories for particular user
export async function getConnectedRepositories() {
  try {
    // Get the session from the request headers by calling the auth api

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("User not authenticated");
    }

    // Find all repositories connected by the user
    const repositories = await prisma.repository.findMany({
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
    });

    return repositories;
  } catch (error) {
    console.error("Error fetching connected repositories:", error);
    return [];
  }
}

// Disconnect a repository
export async function disconnectRepository(repositoryId: string) {
  try {
    // Get the session from the request headers by calling the auth api

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("User not authenticated");
    }

    // Find the repository to ensure it exists and belongs to the user

    const repository = await prisma.repository.findUnique({
      where: {
        id: repositoryId,
        userId: session.user.id,
      },
    });

    if (!repository) {
      throw new Error("Repository not found or not connected to this user");
    }

    // Delete the webhook from GitHub
    await deleteWebhook(repository.owner, repository.name);

    // Delete the repository from the database
    const disconnectedRepository = await prisma.repository.delete({
      where: {
        id: repositoryId,
        userId: session.user.id,
      },
    });

    // Revalidate the repository page to show the updated repositories

    revalidatePath("/dashboard/repository", "page");

    revalidatePath("/dashboard/settings", "page");

    return { success: true, repository: disconnectedRepository };
  } catch (error) {
    console.error("Error disconnecting repository:", error);
    return { success: false, error: "Failed to disconnect repository" };
  }
}

// Disconnect all repositories
export async function disconnectAllRepositories() {
  try {
    // Get the session from the request headers by calling the auth api

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("User not authenticated");
    }

    // Find all repositories connected by the user
    const repositories = await prisma.repository.findMany({
      where: {
        userId: session.user.id,
      },
    });

    // Delete all webhooks from GitHub
    await Promise.all(
      repositories.map(async (repository) => {
        await deleteWebhook(repository.owner, repository.name);
      }),
    );

    // Delete all repositories from the database
    const result = await prisma.repository.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    // Revalidate the repository page to show the updated repositories

    revalidatePath("/dashboard/repository", "page");

    revalidatePath("/dashboard/settings", "page");

    return { success: true, count: result.count };
  } catch (error) {
    console.error("Error disconnecting all repositories:", error);
    return { success: false, error: "Failed to disconnect repositories" };
  }
}
