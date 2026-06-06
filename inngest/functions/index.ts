/* eslint-disable @typescript-eslint/no-explicit-any */

import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import path from "path";
import os from "os";
import { getFileContent, getRepoDiff } from "@/lib/git-utils";
import { filterAndValidateFiles } from "@/lib/file-filter";
import { chunkFileAST, CodeChunkDbInput } from "@/lib/ast-chunker";
import { getGitBlameForLines } from "@/lib/git-blame";
import { chunkArray, generateEmbedding } from "@/lib/embedding";
import { bulkInsertCodeChunks } from "@/lib/db-insert";

export const indexRepositoryHandler = async ({
  event,
  step,
}: {
  event: any;
  step: any;
}) => {
  const { owner, repo, userId, commitSha } = event.data;

  // Fetch Repository state to check for incremental diff

  const repository = await step.run("get-repo-state", async () => {
    const existingRepository = await prisma.repository.findUnique({
      where: {
        owner_name: {
          owner: owner,
          name: repo,
        },
      },
    });

    if (!existingRepository) {
      throw new Error("Repository not found");
    }

    return existingRepository;
  });

  if (!repository) throw new Error("Repository not found");

  // Fetch the github token

  const account = await step.run("get-github-token", async () => {
    const existingAccount = await prisma.account.findFirst({
      where: {
        userId: userId,
        providerId: "github",
      },
    });

    if (!existingAccount?.accessToken) {
      throw new Error("Account not found or access token missing");
    }

    return existingAccount;
  });

  if (!account?.accessToken) throw new Error("Missing GitHub token");

  // Note: The repository is currently cloned into a temporary directory.

  // In a persistent worker architecture, a mounted volume would retain the repository state, enabling efficient incremental Git diff computation across executions.

  const repoDir = path.join(os.tmpdir(), `repo-${repository.id}`);

  const changedFiles = await step.run("fetch-and-diff-files", async () => {
    const allChangedPaths = await getRepoDiff(
      repoDir,
      owner,
      repo,
      account.accessToken,
      repository.lastIndexedCommitSha
    );

    // Apply strict filtering
    const filteredFiles = await filterAndValidateFiles(
      repoDir,
      allChangedPaths
    );

    return filteredFiles;
  });

  // 4. Delete old chunks for changed files (Incremental Invalidation)

  if (changedFiles.length > 0) {
    await step.run("invalidate-old-chunks", async () => {
      await prisma.codeChunk.deleteMany({
        where: {
          repoId: repository.id,
          filePath: {
            in: changedFiles,
          },
        },
      });
    });
  }

  const filesToProcess = await step.run("read-file-contents", async () => {
    const files = await Promise.all(
      changedFiles.map(async (filePath: any) => {
        const content = await getFileContent(repoDir, filePath);

        console.log(
          "[INDEX] Read file:",
          filePath,
          `(${content.length} chars)`
        );

        return {
          filePath,
          content,
        };
      })
    );

    return files;
  });

  const processedChunks = await step.run("ast-parse-and-blame", async () => {
    const allChunks: CodeChunkDbInput[] = [];

    for (const { filePath, content } of filesToProcess) {
      // Chunk the file using Tree-sitter
      const chunks = await chunkFileAST(filePath, content);

      for (const chunk of chunks) {
        // Pre-compute Git Blame for this specific chunk's line range
        const blame = await getGitBlameForLines(
          repoDir,
          filePath,
          chunk.startLine,
          chunk.endLine
        );

        allChunks.push({
          repoId: repository.id,
          filePath: chunk.filePath,
          startLine: chunk.startLine,
          endLine: chunk.endLine,
          language: path.extname(filePath).slice(1).toLowerCase(), // 'ts', 'py', etc.
          content: chunk.content,
          signature: chunk.signature,
          imports: chunk.imports,
          lastModifiedCommit: blame?.commitHash || null,
          authorName: blame?.authorName || null,
          // NOTE: We are NOT inserting the embedding yet.
          // That happens in Step 4. We pass a placeholder or null for now.
          embedding: undefined,
        });
      }
    }

    return allChunks;
  });

  const EMBEDDING_BATCH_SIZE = 15;

  // Generate embeddings + insert into DB

  await step.run("embed-and-insert-chunks", async () => {
    if (processedChunks.length === 0) {
      console.log("No chunks to embed");
      return;
    }

    const batches = chunkArray(processedChunks, EMBEDDING_BATCH_SIZE);

    console.log(
      `[INDEX] Generating embeddings for ${processedChunks.length} chunks in ${batches.length} batches`
    );

    for (const [index, batch] of batches.entries()) {
      console.log(
        `[INDEX] Processing embedding batch ${index + 1}/${batches.length}`
      );

      const chunksWithEmbeddings = await Promise.all(
        batch.map(async (chunk: any) => {
          const embedding = await generateEmbedding(chunk.content);

          return {
            ...chunk,
            embedding,
          };
        })
      );

      await bulkInsertCodeChunks(chunksWithEmbeddings);

      console.log(`[INDEX] Inserted ${chunksWithEmbeddings.length} chunks`);
    }
  });

  // Update repository indexing state
  await step.run("update-repository-state", async () => {
    await prisma.repository.update({
      where: {
        id: repository.id,
      },
      data: {
        lastIndexedCommitSha: commitSha,
      },
    });

    console.log(`[INDEX] Updated last indexed commit to ${commitSha}`);
  });

  return {
    repositoryId: repository.id,
    filesProcessed: changedFiles.length,
    chunksGenerated: processedChunks.length,
    indexedCommitSha: commitSha,
  };
};

export const indexRepository = inngest.createFunction(
  {
    id: "index-repo",
    triggers: { event: "repository.connected" },
  },
  indexRepositoryHandler
);