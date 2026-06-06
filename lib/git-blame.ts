import simpleGit from "simple-git";

export interface BlameInfo {
  commitHash: string;
  authorName: string;
}

export const getGitBlameForLines = async (
  repoDir: string,
  filePath: string,
  startLine: number,
  endLine: number
): Promise<BlameInfo | null> => {
  const git = simpleGit(repoDir);

  try {
    // Use porcelain output for stable, machine-readable parsing and restrict blame data to the target line range.

    const blameOutput = await git.raw([
      "blame",
      "-p",
      `-L${startLine},${endLine}`,
      filePath,
    ]);

    // Parse porcelain format to get the first commit hash and author
    const lines = blameOutput.split("\n");

    if (lines.length === 0) return null;

    // Parse the blame header: <commit> <source_line> <target_line> <line_count>
    const commitHash = lines[0].split(" ")[0];

    // Find the author line
    const authorLine = lines.find((l) => l.startsWith("author "));
    const authorName = authorLine ? authorLine.substring(7) : "Unknown";

    return { commitHash, authorName };
  } catch (error) {
    console.warn(`Failed to get git blame for ${filePath}:`, error);
    return null;
  }
};
