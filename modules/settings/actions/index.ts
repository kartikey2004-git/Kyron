"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
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
