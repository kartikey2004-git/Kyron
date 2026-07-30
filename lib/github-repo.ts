import { Octokit } from "octokit";

// No outbound GitHub call anywhere in this file (or modules/github/lib/github.ts,
// or the inline Octokit calls in inngest/functions/index.ts) had a
// timeout before this — a slow/hung GitHub API response would hang
// indexRepository indefinitely (bounded only by Inngest's own, much
// longer, function-level timeout). A fresh AbortSignal per call, not one
// shared across a function's multiple calls — AbortSignal.timeout()
// starts counting the moment it's created, so reusing one across several
// sequential requests would incorrectly count their combined duration
// against a single budget.
const GITHUB_REQUEST_TIMEOUT_MS = 15_000;
function withTimeout() {
  return { signal: AbortSignal.timeout(GITHUB_REQUEST_TIMEOUT_MS) };
}

const VALID_EXTENSIONS = [
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".py",
  ".java",
  ".go",
  ".rs",
  ".cpp",
  ".c",
  ".h",
  ".hpp",
  ".rb",
  ".php",
  ".cs",
  ".vue",
  ".svelte",
];

const IGNORED_PATTERNS = [
  "node_modules",
  "dist",
  "build",
  ".next",
  "coverage",
  ".git",
  "vendor",
  "target",
  "out",
];

export function isValidCodeFile(filePath: string): boolean {
  const ext = filePath.substring(filePath.lastIndexOf(".")).toLowerCase();
  const hasValidExt = VALID_EXTENSIONS.includes(ext);
  const isIgnored = IGNORED_PATTERNS.some((pattern) =>
    filePath.includes(pattern)
  );
  return hasValidExt && !isIgnored;
}

export async function getChangedFiles(
  owner: string,
  repo: string,
  accessToken: string,
  previousSha: string | null,
  currentSha: string
) {
  const octokit = new Octokit({ auth: accessToken });

  if (!currentSha) {
    throw new Error(`Missing currentSha for ${owner}/${repo}`);
  }

  if (!previousSha) {
    const commit = await octokit.rest.git.getCommit({
      owner,
      repo,
      commit_sha: currentSha,
      request: withTimeout(),
    });

    const tree = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: commit.data.tree.sha,
      recursive: "true",
      request: withTimeout(),
    });

    return tree.data.tree
      .filter(
        (
          item
        ): item is typeof item & {
          path: string;
          type: "blob";
        } => item.type === "blob" && item.path !== null
      )
      .map((item) => item.path)
      .filter(isValidCodeFile);
  }

  // Incremental: Compare commits
  const comparison = await octokit.rest.repos.compareCommits({
    owner,
    repo,
    base: previousSha,
    head: currentSha,
    request: withTimeout(),
  });

  return (
    comparison.data.files
      ?.map((f) => f.filename)
      .filter((f): f is string => !!f && isValidCodeFile(f)) ?? []
  );
}

export async function getFileContentFromGithub(
  owner: string,
  repo: string,
  accessToken: string,
  filePath: string,
  ref: string
) {
  const octokit = new Octokit({ auth: accessToken });

  try {
    const file = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: filePath,
      ref,
      request: withTimeout(),
    });

    if (!("content" in file.data)) return null;
    return Buffer.from(file.data.content, "base64").toString("utf8");
  } catch (error) {
    console.error(`Failed to fetch ${filePath}:`, error);
    return null;
  }
}

export async function getCommitAuthor(
  owner: string,
  repo: string,
  accessToken: string,
  commitSha: string
) {
  const octokit = new Octokit({ auth: accessToken });

  try {
    const commit = await octokit.rest.repos.getCommit({
      owner,
      repo,
      ref: commitSha,
      request: withTimeout(),
    });
    return {
      name: commit.data.commit.author?.name ?? null,
      email: commit.data.commit.author?.email ?? null,
    };
  } catch {
    return { name: null, email: null };
  }
}
