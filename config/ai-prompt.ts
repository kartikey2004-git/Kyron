import { z } from "zod";
import { lazyConfig, parseEnv } from "./env";

// prompt and budget settings with safe defaults.

const schema = z.object({
  // Maximum size of the PR diff we send to the AI reviewer and larger diffs are trimmed so the review does not consume too much context.

  MAX_DIFF_CHARS: z.coerce.number().int().positive().default(60_000),

  // Maximum amount of relevant code context retrieved from the codebase and included alongside the PR diff.

  MAX_CONTEXT_CHARS: z.coerce.number().int().positive().default(40_000),

  // Minimum length required for an AI review to be considered a valid response because very short responses are usually empty, malformed, or a refusal.

  REVIEW_MIN_LENGTH: z.coerce.number().int().positive().default(50),

  // Maximum number of code chunks retrieved from the indexed codebase for a single review because more chunks give more context but also use more tokens.

  REVIEW_CONTEXT_CHUNK_LIMIT: z.coerce.number().int().positive().default(15),
});

export const getAiPromptConfig = lazyConfig(() => {
  // Validate the environment variables against the schema before using them.

  const env = parseEnv(schema);

  return {
    maxDiffChars: env.MAX_DIFF_CHARS,
    maxContextChars: env.MAX_CONTEXT_CHARS,
    reviewMinLength: env.REVIEW_MIN_LENGTH,
    reviewContextChunkLimit: env.REVIEW_CONTEXT_CHUNK_LIMIT,
  };
});

// `z.coerce` converts input values to the expected type before validating them.
