import { z } from "zod";
import { lazyConfig, parseEnv } from "./env";

// configuration for controlling how long different dashboard data stays cached because each module has its own TTL because some data changes more often than others.

const schema = z.object({
  // How long settings data stays cached because it usually changes infrequently

  SETTINGS_CACHE_TTL_SECONDS: z.coerce.number().int().positive().default(600),

  // How long review data stays cached because new reviews can be added frequently.

  REVIEW_CACHE_TTL_SECONDS: z.coerce.number().int().positive().default(120),

  // How long repository data stays cached because repository information does not change often.

  REPOSITORY_CACHE_TTL_SECONDS: z.coerce.number().int().positive().default(300),

  // How long dashboard data stays cached before it is refreshed.

  DASHBOARD_CACHE_TTL_SECONDS: z.coerce.number().int().positive().default(300),
});

export const getCacheTtlConfig = lazyConfig(() => {
  // Validate the environment variables against the schema before using them.

  const env = parseEnv(schema);

  return {
    settingsSeconds: env.SETTINGS_CACHE_TTL_SECONDS,
    reviewSeconds: env.REVIEW_CACHE_TTL_SECONDS,
    repositorySeconds: env.REPOSITORY_CACHE_TTL_SECONDS,
    dashboardSeconds: env.DASHBOARD_CACHE_TTL_SECONDS,
  };
});
