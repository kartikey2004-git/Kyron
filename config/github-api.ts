import { z } from "zod";
import { lazyConfig, parseEnv } from "./env";

// config which controls GitHub API request timeouts and response caching because short cache durations reduce repeated API calls while keeping data reasonably fresh.

const schema = z.object({
  // Maximum time allowed for a GitHub API request before it is cancelled.

  GITHUB_REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(15_000),

  // How long user contribution data stays cached before it is refreshed.

  GITHUB_CACHE_TTL_USER_CONTRIBUTIONS_SECONDS: z.coerce
    .number()
    .int()
    .positive()
    .default(60 * 5),

  // How long the user's repository list stays cached before it is refreshed.

  GITHUB_CACHE_TTL_USER_REPOSITORIES_SECONDS: z.coerce
    .number()
    .int()
    .positive()
    .default(60 * 10),

  // How long a repository file stays cached before fetching it again.

  GITHUB_CACHE_TTL_REPOSITORY_FILE_SECONDS: z.coerce
    .number()
    .int()
    .positive()
    .default(60 * 2),

  // How long a pull request diff stays cached before fetching the latest version.

  GITHUB_CACHE_TTL_PULL_REQUEST_DIFF_SECONDS: z.coerce
    .number()
    .int()
    .positive()
    .default(60),
});

export const getGithubApiConfig = lazyConfig(() => {
  // Validate the environment variables against the schema before using them.

  const env = parseEnv(schema);

  return {
    requestTimeoutMs: env.GITHUB_REQUEST_TIMEOUT_MS,
    cacheTtl: {
      userContributions: env.GITHUB_CACHE_TTL_USER_CONTRIBUTIONS_SECONDS,
      userRepositories: env.GITHUB_CACHE_TTL_USER_REPOSITORIES_SECONDS,
      repositoryFile: env.GITHUB_CACHE_TTL_REPOSITORY_FILE_SECONDS,
      pullRequestDiff: env.GITHUB_CACHE_TTL_PULL_REQUEST_DIFF_SECONDS,
    },
  };
});
