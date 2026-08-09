import { z } from "zod";
import { lazyConfig, parseEnv } from "./env";

// configure GitHub OAuth environment vars which are required for GitHub sign-in to work.

const schema = z.object({
  // GitHub OAuth application ID used when starting the GitHub sign-in flow.

  GITHUB_CLIENT_ID: z.string().min(1, "GITHUB_CLIENT_ID is required"),

  // GitHub OAuth application secret used to securely authenticate our application with GitHub.

  GITHUB_CLIENT_SECRET: z.string().min(1, "GITHUB_CLIENT_SECRET is required"),
});

export const getGithubOAuthConfig = lazyConfig(() => {
  // Validate the environment variables against the schema before using them.

  const env = parseEnv(schema);

  return {
    clientId: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
  };
});
