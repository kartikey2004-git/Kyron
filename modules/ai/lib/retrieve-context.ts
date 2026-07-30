import prisma from "@/lib/db";
import { generateEmbedding } from "@/lib/embedding";
import { getLogger } from "@/lib/logger";

interface RetrievedChunk {
  content: string;
  filePath: string;
  similarity: number;
}

export const retrieveContext = async (
  query: string,
  repositoryId: string,
  limit = 15
): Promise<RetrievedChunk[]> => {
  const logger = getLogger({ repositoryId });

  const embedding = await generateEmbedding(query);

  const vector = `[${embedding.join(",")}]`;

  const queryStartedAt = Date.now();

  const results = await prisma.$queryRaw<
    {
      content: string;
      filePath: string;
      similarity: number;
    }[]
  >`
    SELECT
      content,
      "filePath",
      1 - (embedding <=> ${vector}::vector) as similarity
    FROM "CodeChunk"
    WHERE "repoId" = ${repositoryId}
    ORDER BY embedding <=> ${vector}::vector
    LIMIT ${limit}
  `;

  logger.info(
    { durationMs: Date.now() - queryStartedAt, resultCount: results.length },
    "pgvector similarity query completed"
  );

  return results;
};
