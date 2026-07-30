"use server";

import { auth } from "@/lib/auth";
import { getLogger } from "@/lib/logger";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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

export const requireUnAuthenticated = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }

  return session;
};
