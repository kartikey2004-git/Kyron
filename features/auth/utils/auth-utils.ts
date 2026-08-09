"use server";

/*

Route guard helpers built on Better Auth's session lookup.
 
  - Centralizes authentication redirects, so every server component and action follows the same session lookup and redirect logic instead of maintaining its own implementation.

*/

import { auth } from "@/server/auth/auth";
import { getLogger } from "@/server/observability/logger";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Guards server components and actions that require authentication while returning the resolved session for the rest of the request.

export const requireAuthenticated = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    getLogger().warn("unauthenticated request redirected to /login");
    redirect("/login");
  }

  return session;
};

// Prevents signed-in users from accessing pages intended for guests, such as the login page, by redirecting them to the dashboard.

export const requireUnAuthenticated = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return session;
};
