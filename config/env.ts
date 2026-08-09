import { z } from "zod";

// Shared helpers for environment-based configuration because each config module can validate only the variables it needs instead of requiring the entire application's environment.

export function parseEnv<Shape extends z.ZodRawShape>(
  schema: z.ZodObject<Shape>,
  env: NodeJS.ProcessEnv = process.env
): z.infer<z.ZodObject<Shape>> {
  const result = schema.safeParse(env);

  if (!result.success) {
    const issues = result.error.issues
      .map(
        (issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`
      )
      .join("\n");

    throw new Error(`Invalid environment configuration:\n${issues}`);
  }

  return result.data;
}

// Delays config validation until the config is actually needed, so this prevents an unrelated missing environment variable from  breaking the application just because the config was imported. The result is cached after the first read.

export function lazyConfig<T>(factory: () => T): () => T {
  let cached: T | undefined;
  let hasRun = false;

  return () => {
    if (!hasRun) {
      cached = factory();
      hasRun = true;
    }
    return cached as T;
  };
}

// Environment variables are strings, so this converts the common "1" and "true" values into a boolean for feature flags.

export const booleanFlag = z
  .string()
  .optional()
  .transform((value) => value === "1" || value?.toLowerCase() === "true");
