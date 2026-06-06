import prisma from "@/lib/db";
import { generateEmbedding } from "@/lib/embedding";

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
  const embedding = await generateEmbedding(query);

  const vector = `[${embedding.join(",")}]`;

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

  return results;
};
