import { z } from "zod";
import { lazyConfig, parseEnv } from "./env";

// configures the Redis connection used for caching, Redis is only a cache, so the application can continue working if it is unavailable.

const schema = z.object({
  // Redis connection URL used by the application's cache layer.

  REDIS_URL: z.string().min(1).default("redis://localhost:6379"),
});

export const getRedisConfig = lazyConfig(() => {
  // Validate the environment variable against the schema before using it.

  const env = parseEnv(schema);

  return { url: env.REDIS_URL };
});
