import { z } from "zod";
import { lazyConfig, parseEnv } from "./env";

// configs which control rate limits for incoming webhook and Inngest requests. Separate limits are used because they protect different endpoints and workloads.

const webhookSchema = z.object({
  // Maximum number of webhook requests allowed from one IP within the time window.

  WEBHOOK_IP_RATE_LIMIT: z.coerce.number().int().positive().default(60),

  // Time window used for the IP-based webhook rate limit.

  WEBHOOK_IP_RATE_WINDOW_SECONDS: z.coerce
    .number()
    .int()
    .positive()
    .default(60),

  // Maximum number of review runs allowed for one repository within the time window.

  WEBHOOK_REPO_REVIEW_LIMIT: z.coerce.number().int().positive().default(20),

  // Time window used for the per-repository review rate limit.

  WEBHOOK_REPO_REVIEW_WINDOW_SECONDS: z.coerce
    .number()
    .int()
    .positive()
    .default(300),
});

export const getWebhookRateLimitConfig = lazyConfig(() => {
  // Validate the environment variables against the schema before using them.

  const env = parseEnv(webhookSchema);

  return {
    ip: {
      limit: env.WEBHOOK_IP_RATE_LIMIT,
      windowSeconds: env.WEBHOOK_IP_RATE_WINDOW_SECONDS,
    },
    repoReview: {
      limit: env.WEBHOOK_REPO_REVIEW_LIMIT,
      windowSeconds: env.WEBHOOK_REPO_REVIEW_WINDOW_SECONDS,
    },
  };
});

// Inngest has its own request signature verification, but an IP based limit provides an additional layer of protection against excessive requests.

const inngestSchema = z.object({
  // Maximum number of Inngest requests allowed from one IP within the time window.

  INNGEST_IP_RATE_LIMIT: z.coerce.number().int().positive().default(120),

  // Time window used for the Inngest IP-based rate limit.

  INNGEST_IP_RATE_WINDOW_SECONDS: z.coerce
    .number()
    .int()
    .positive()
    .default(60),
});

export const getInngestRouteRateLimitConfig = lazyConfig(() => {
  // Validate the environment variables against the schema before using them.

  const env = parseEnv(inngestSchema);

  return {
    limit: env.INNGEST_IP_RATE_LIMIT,
    windowSeconds: env.INNGEST_IP_RATE_WINDOW_SECONDS,
  };
});
