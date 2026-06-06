import { Prisma } from "@/lib/generated/prisma/client";
import { CodeChunkDbInput } from "./ast-chunker";
import prisma from "./db";
import { randomUUID, createHash } from "crypto";

const BATCH_SIZE = 1000;

function generateContentHash(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

export async function bulkInsertCodeChunks(
  chunks: CodeChunkDbInput[]
): Promise<void> {
  if (!chunks.length) return;

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);

    const values = Prisma.join(
      batch.map((chunk) => {
        const vector = JSON.stringify(chunk.embedding);

        const contentHash = generateContentHash(chunk.content);

        return Prisma.sql`(
          ${randomUUID()},
          ${chunk.repoId},
          ${chunk.filePath},
          ${chunk.startLine},
          ${chunk.endLine},
          ${chunk.language},
          ${chunk.content},
          ${chunk.signature},
          ${chunk.imports},
          ${chunk.lastModifiedCommit},
          ${chunk.authorName},
          ${contentHash},
          ${vector}::vector,
          NOW(),
          NOW()
        )`;
      })
    );

    await prisma.$executeRaw`
      INSERT INTO "CodeChunk" (
        id,
        "repoId",
        "filePath",
        "startLine",
        "endLine",
        language,
        content,
        signature,
        imports,
        "lastModifiedCommit",
        "authorName",
        "contentHash",
        embedding,
        "createdAt",
        "updatedAt"
      )
      VALUES ${values}
      ON CONFLICT ("repoId", "filePath", "startLine", "endLine")
      DO UPDATE SET
        language = EXCLUDED.language,
        content = EXCLUDED.content,
        signature = EXCLUDED.signature,
        imports = EXCLUDED.imports,
        "lastModifiedCommit" = EXCLUDED."lastModifiedCommit",
        "authorName" = EXCLUDED."authorName",
        "contentHash" = EXCLUDED."contentHash",
        embedding = EXCLUDED.embedding,
        "updatedAt" = NOW()
    `;
  }
}
