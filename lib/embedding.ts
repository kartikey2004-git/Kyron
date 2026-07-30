import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";
import { getLogger } from "@/lib/logger";
import { getOrSet, hashKey } from "@/lib/cache";
import { embeddingGenerationDuration } from "@/lib/metrics";
import { withSpan } from "@/lib/tracing";
config();

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!apiKey) {
  throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is missing");
}

const ai = new GoogleGenAI({
  apiKey,
});

const EMBEDDING_MODEL = "gemini-embedding-001";

const OUTPUT_DIMENSIONS = 768;
const MAX_BACKOFF_MS = 30000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Exponential backoff with jitter

async function delayWithJitter(
  attempt: number,
  baseDelayMs = 1000
): Promise<void> {
  const exponentialDelay = baseDelayMs * Math.pow(2, attempt);

  const jitter = Math.floor(Math.random() * 1000);

  const totalDelay = Math.min(exponentialDelay + jitter, MAX_BACKOFF_MS);

  getLogger().warn(
    { attempt: attempt + 1, delayMs: totalDelay },
    "embedding call retrying after backoff"
  );

  await sleep(totalDelay);
}

function getStatusCode(error: unknown): number | undefined {
  if (typeof error === "object" && error !== null) {
    const err = error as {
      status?: number;
      code?: number;
      response?: {
        status?: number;
      };
    };

    return err.status ?? err.code ?? err.response?.status;
  }

  return undefined;
}

function isRetryableError(error: unknown): boolean {
  const status = getStatusCode(error);

  return (
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  );
}

export async function generateEmbedding(
  text: string,
  maxRetries = 5
): Promise<number[]> {
  const content = text.trim();

  if (!content) {
    throw new Error("Cannot generate embedding for empty text");
  }

  // Content-addressed: the key IS the hash of the exact chunk text, so a
  // cache hit is definitionally still correct — no TTL, no invalidation
  // needed. Reindexing unchanged files across runs becomes free.
  return getOrSet(`embedding:${hashKey(content)}`, null, () =>
    generateEmbeddingUncached(content, maxRetries)
  );
}

async function generateEmbeddingUncached(
  content: string,
  maxRetries: number
): Promise<number[]> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const stopTimer = embeddingGenerationDuration.startTimer();

    try {
      const response = await withSpan(
        "gemini.embedContent",
        () =>
          ai.models.embedContent({
            model: EMBEDDING_MODEL,
            contents: content,
            config: {
              outputDimensionality: OUTPUT_DIMENSIONS,
            },
          }),
        { "gemini.model": EMBEDDING_MODEL }
      );

      const embedding = response.embeddings?.[0]?.values;

      if (!embedding?.length) {
        throw new Error("Embedding response was empty");
      }

      stopTimer();
      return embedding;
    } catch (error) {
      lastError = error;

      const status = getStatusCode(error);

      getLogger().error(
        {
          attempt: attempt + 1,
          maxAttempts: maxRetries + 1,
          status,
          err: error instanceof Error ? error.message : String(error),
        },
        "embedding generation attempt failed"
      );

      if (attempt === maxRetries || !isRetryableError(error)) {
        break;
      }

      await delayWithJitter(attempt);
    }
  }

  throw new Error(
    `Failed to generate embedding after ${maxRetries + 1} attempts: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`
  );
}

// Helper to chunk array into smaller batches

export function chunkArray<T>(array: T[], size: number): T[][] {
  if (size <= 0) {
    throw new Error("Chunk size must be greater than 0");
  }

  const chunks: T[][] = [];

  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }

  return chunks;
}
