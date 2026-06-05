import simpleGit, { SimpleGit } from "simple-git";
import path from "path";
import fs from "fs/promises";

// Prevent hanging git operations
async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  operation: string
): Promise<T> {
  let timeoutId: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Git operation '${operation}' timed out after ${ms}ms`));
    }, ms);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId!);
  }
}

// Check whether a directory exists
async function exists(dir: string): Promise<boolean> {
  try {
    await fs.access(dir);
    return true;
  } catch {
    return false;
  }
}

export async function getRepoDiff(
  repoDir: string,
  owner: string,
  repo: string,
  accessToken: string,
  lastIndexedCommitSha: string | null
): Promise<string[]> {
  const repoExists = await exists(repoDir);

  if (!repoExists) {
    const remoteUrl = accessToken
      ? `https://x-access-token:${accessToken}@github.com/${owner}/${repo}.git`
      : `https://github.com/${owner}/${repo}.git`;

    await withTimeout(
      simpleGit().clone(remoteUrl, repoDir, ["--depth", "1"]),
      60_000,
      "clone"
    );
  }

  const git: SimpleGit = simpleGit(repoDir);

  // Always fetch latest changes
  await withTimeout(git.fetch("origin"), 30_000, "fetch");

  if (lastIndexedCommitSha) {
    // Incremental indexing
    const diffOutput = await withTimeout(
      git.raw(["diff", "--name-only", lastIndexedCommitSha, "HEAD"]),
      30_000,
      "diff"
    );

    return diffOutput
      .split("\n")
      .map((file) => file.trim())
      .filter(Boolean);
  }

  // First-time indexing
  const lsOutput = await withTimeout(git.raw(["ls-files"]), 30_000, "ls-files");

  return lsOutput
    .split("\n")
    .map((file) => file.trim())
    .filter(Boolean);
}

export async function getFileContent(
  repoDir: string,
  filePath: string
): Promise<string> {
  const fullPath = path.join(repoDir, filePath);

  return fs.readFile(fullPath, "utf8");
}

export async function getCurrentCommitSha(repoDir: string): Promise<string> {
  const git = simpleGit(repoDir);

  return withTimeout(git.revparse(["HEAD"]), 10_000, "rev-parse");
}
