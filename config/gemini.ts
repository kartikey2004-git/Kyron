import { z } from "zod";
import { lazyConfig, parseEnv } from "./env";

// configure Gemini for AI reviews and code embeddings , the Gemini API key is required, while the remaining values have safe defaults.

const schema = z.object({
  // API key used to authenticate requests to Google's Gemini API.

  GOOGLE_GENERATIVE_AI_API_KEY: z
    .string()
    .min(1, "GOOGLE_GENERATIVE_AI_API_KEY is missing"),

  // Gemini model used to generate AI code reviews.
  REVIEW_MODEL: z.string().min(1).default("gemini-2.5-flash"),

  // Maximum number of tokens Gemini can generate for a single review.

  REVIEW_MAX_OUTPUT_TOKENS: z.coerce.number().int().positive().default(8_192),

  // Maximum time allowed for a Gemini review request before it is cancelled.

  REVIEW_GENERATE_TEXT_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(60_000),

  // Gemini model used to generate embeddings for indexed code.

  EMBEDDING_MODEL: z.string().min(1).default("gemini-embedding-001"),

  // Number of dimensions produced by the embedding model.

  EMBEDDING_OUTPUT_DIMENSIONS: z.coerce.number().int().positive().default(768),

  // Maximum delay between embedding retries when Gemini is rate-limited or temporarily unavailable.

  EMBEDDING_MAX_BACKOFF_MS: z.coerce.number().int().positive().default(30_000),
});

export const getGeminiConfig = lazyConfig(() => {
  // Validate the environment variables against the schema before using them.

  const env = parseEnv(schema);

  return {
    apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
    review: {
      model: env.REVIEW_MODEL,
      maxOutputTokens: env.REVIEW_MAX_OUTPUT_TOKENS,
      generateTextTimeoutMs: env.REVIEW_GENERATE_TEXT_TIMEOUT_MS,
    },
    embedding: {
      model: env.EMBEDDING_MODEL,
      outputDimensions: env.EMBEDDING_OUTPUT_DIMENSIONS,
      maxBackoffMs: env.EMBEDDING_MAX_BACKOFF_MS,
    },
  };
});
