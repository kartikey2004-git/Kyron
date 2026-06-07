/* eslint-disable @typescript-eslint/no-explicit-any */

import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { chunkFileAST, CodeChunkDbInput } from "@/lib/ast-chunker";
import { chunkArray, generateEmbedding } from "@/lib/embedding";
import { bulkInsertCodeChunks } from "@/lib/db-insert";
import {
  getChangedFiles,
  getCommitAuthor,
  getFileContentFromGithub,
} from "@/lib/github-repo";
import { Octokit } from "octokit";

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

  // Get changed files via GitHub API (NO clone, NO git binary)

  const octokit = new Octokit({
    auth: account.accessToken,
  });

  let effectiveCommitSha = commitSha;

  // First repository indexing

  if (!effectiveCommitSha) {
    const repoInfo = await octokit.rest.repos.get({
      owner,
      repo,
    });

    const branch = await octokit.rest.repos.getBranch({
      owner,
      repo,
      branch: repoInfo.data.default_branch,
    });

    effectiveCommitSha = branch.data.commit.sha;

    console.log(`[INDEX] Using default branch HEAD: ${effectiveCommitSha}`);
  }

  console.log({
    owner,
    repo,
    effectiveCommitSha,
    previousSha: repository.lastIndexedCommitSha,
  });

  const changedFiles = await step.run("fetch-and-diff-files", async () => {
    return await getChangedFiles(
      owner,
      repo,
      account.accessToken,
      repository.lastIndexedCommitSha,
      effectiveCommitSha
    );
  });

  // Get commit author info (replaces git blame metadata)

  const commitAuthor = await step.run("get-commit-author", async () => {
    return await getCommitAuthor(
      owner,
      repo,
      account.accessToken,
      effectiveCommitSha
    );
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

  // Read file contents via GitHub API

  const filesToProcess = await step.run("read-file-contents", async () => {
    const files = await Promise.all(
      changedFiles.map(async (filePath: string) => {
        const content = await getFileContentFromGithub(
          owner,
          repo,
          account.accessToken,
          filePath,
          effectiveCommitSha
        );

        if (!content) return null;

        console.log(
          "[INDEX] Read file:",
          filePath,
          `(${content.length} chars)`
        );
        return { filePath, content };
      })
    );

    return files.filter(
      (f): f is { filePath: string; content: string } => f !== null
    );
  });

  // AST Parse + Chunk (NO git blame, using commitSha + author from API)

  const processedChunks = await step.run("ast-parse-and-chunk", async () => {
    const allChunks: CodeChunkDbInput[] = [];

    for (const { filePath, content } of filesToProcess) {
      const chunks = await chunkFileAST(filePath, content);

      for (const chunk of chunks) {
        allChunks.push({
          repoId: repository.id,
          filePath: chunk.filePath,
          startLine: chunk.startLine,
          endLine: chunk.endLine,
          language: chunk.filePath.split(".").pop()?.toLowerCase() || "unknown",
          content: chunk.content,
          signature: chunk.signature,
          imports: chunk.imports,
          // Using commitSha + author from API instead of per-line git blame
          lastModifiedCommit: effectiveCommitSha,
          authorName: commitAuthor.name,
          embedding: undefined, // Placeholder, filled in next step
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
          return { ...chunk, embedding };
        })
      );

      await bulkInsertCodeChunks(chunksWithEmbeddings);
      console.log(`[INDEX] Inserted ${chunksWithEmbeddings.length} chunks`);
    }
  });

  // Update repository indexing state
  await step.run("update-repository-state", async () => {
    await prisma.repository.update({
      where: { id: repository.id },
      data: { lastIndexedCommitSha: effectiveCommitSha },
    });
    console.log(`[INDEX] Updated last indexed commit to ${commitSha}`);
  });

  return {
    repositoryId: repository.id,
    filesProcessed: changedFiles.length,
    chunksGenerated: processedChunks.length,
    indexedCommitSha: effectiveCommitSha,
  };
};

export const indexRepository = inngest.createFunction(
  {
    id: "index-repo",
    triggers: { event: "repository.connected" },
  },
  indexRepositoryHandler
);
