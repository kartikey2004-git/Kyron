import { z } from "zod";
import { booleanFlag, lazyConfig, parseEnv } from "./env";

// config which controls how the app connects to Inngest, both values are optional here because production-specific checks are enforced where the Inngest client is created.

const schema = z.object({
  // Enables Inngest dev mode for local development and local test environments.

  INNGEST_DEV: booleanFlag,

  // Signing key used to verify requests from Inngest Cloud.

  INNGEST_SIGNING_KEY: z.string().min(1).optional(),
});

export const getInngestConfig = lazyConfig(() => {
  // Validate the environment variables against the schema before using them.

  const env = parseEnv(schema);

  return {
    devMode: env.INNGEST_DEV,
    signingKey: env.INNGEST_SIGNING_KEY,
  };
});
