import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  session: {
    // Signed/encrypted cookie cache for getSession() — avoids a DB round
    // trip on every request. This is the session-lookup caching called for
    // in plan.md's Redis phase; a separate Redis-backed session cache would
    // duplicate this and be strictly worse (it wouldn't auto-invalidate on
    // logout/cookie-clear the way this does). See docs/caching-strategy.md.
    cookieCache: {
      enabled: true,
      maxAge: 300, // 5 minutes
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      scope: ["repo"],
    },
  },
});
