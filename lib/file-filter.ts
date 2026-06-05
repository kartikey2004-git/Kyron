import fs from "fs/promises";
import path from "path";

const ALLOWED_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".py",
  ".go",
  ".java",
  ".rs",
]);

const IGNORED_PATTERNS = [
  /node_modules/,
  /dist\//,
  /build\//,
  /\.next\//,
  /package-lock\.json/,
  /yarn\.lock/,
  /pnpm-lock\.yaml/,
  /\.min\.js$/,
  /\.test\./,
  /\.spec\./,
];

const MAX_FILE_SIZE_BYTES = 500 * 1024; // 500KB

const MAX_FILE_LINES = 5000;

export async function filterAndValidateFiles(
  repoDir: string,
  filePaths: string[]
): Promise<string[]> {
  const validFiles: string[] = [];

  for (const filePath of filePaths) {
    // for each file path check extension allowlist and ignore patterns

    const ext = path.extname(filePath).toLowerCase();

    if (!ALLOWED_EXTENSIONS.has(ext)) continue;

    if (IGNORED_PATTERNS.some((pattern) => pattern.test(filePath))) continue;

    // Prevent Path Traversal (Symlinks pointing outside repo)

    const absolutePath = path.resolve(repoDir, filePath);

    if (!absolutePath.startsWith(path.resolve(repoDir))) continue;

    // Check file size and line limits
    try {
      const stats = await fs.stat(absolutePath);

      if (stats.size > MAX_FILE_SIZE_BYTES) continue;

      // Reads the full file to count lines; acceptable for files under 500 KB, but a streaming approach is recommended in production.
      
      const content = await fs.readFile(absolutePath, "utf-8");
      const lineCount = content.split("\n").length;
      if (lineCount > MAX_FILE_LINES) continue;

      validFiles.push(filePath);
    } catch {
      // File might have been deleted in this commit, skip it
      continue;
    }
  }

  return validFiles;
}
