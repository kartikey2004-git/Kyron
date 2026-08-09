import { z } from "zod";
import { lazyConfig, parseEnv } from "./env";

// configs which controls repository indexing performance and resource usage, so the limits help keep GitHub requests, embedding work, database writes, and AST parsing within reasonable bounds.

const schema = z.object({
  // Maximum number of GitHub file-content requests that can run at the same time.

  FILE_FETCH_CONCURRENCY: z.coerce.number().int().positive().default(8),

  // Number of code chunks sent to the embedding service in a single batch.

  EMBEDDING_BATCH_SIZE: z.coerce.number().int().positive().default(15),

  // Number of code chunks written to the database in a single INSERT operation.

  DB_INSERT_BATCH_SIZE: z.coerce.number().int().positive().default(1_000),

  // Maximum file size allowed for AST parsing to prevent unusually large files from consuming too much CPU usage and blocking other work.

  AST_MAX_PARSEABLE_FILE_CHARS: z.coerce
    .number()
    .int()
    .positive()
    .default(500_000),

  // Maximum amount of text allowed in a single AST chunk before it is embedded. This keeps chunks within the embedding model's input limits.

  AST_MAX_CHUNK_CONTENT_CHARS: z.coerce
    .number()
    .int()
    .positive()
    .default(20_000),
});

export const getIndexingConfig = lazyConfig(() => {
  // Validate the environment variables against the schema before using them.

  const env = parseEnv(schema);

  return {
    fileFetchConcurrency: env.FILE_FETCH_CONCURRENCY,
    embeddingBatchSize: env.EMBEDDING_BATCH_SIZE,
    dbInsertBatchSize: env.DB_INSERT_BATCH_SIZE,
    astMaxParseableFileChars: env.AST_MAX_PARSEABLE_FILE_CHARS,
    astMaxChunkContentChars: env.AST_MAX_CHUNK_CONTENT_CHARS,
  };
});
