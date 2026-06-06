import path from "path";
import { getLanguage, initTreeSitter } from "@/lib/tree-sitter";
import { Node } from "web-tree-sitter";

// The raw output from the Tree-sitter AST Chunker
export interface ChunkData {
  filePath: string;
  startLine: number;
  endLine: number;
  content: string; // The actual source code text
  signature: string; // The function/class declaration line
  imports: string[]; // Extracted import/require statements
}

// Normalized chunk representation used for embedding generation and database storage.

export interface CodeChunkDbInput {
  repoId: string;

  // Source location
  filePath: string;
  startLine: number;
  endLine: number;

  // Metadata
  language: string; // Normalized extension (e.g., 'ts', 'py')
  content: string;
  signature: string | null;
  imports: string[];

  // Pre-computed Git Blame
  lastModifiedCommit: string | null;
  authorName: string | null;

  embedding?: number[]; // Embedding vector stored as a numeric array and serialized to Postgres vector format at write time.
}

// Node types that represent logical code blocks

const TARGET_NODE_TYPES = new Set([
  "function_declaration",
  "method_definition",
  "class_declaration",
  "function_definition",
  "class_definition",
]);

function isArrowFunctionDeclaration(node: Node): boolean {
  if (node.type !== "lexical_declaration") {
    return false;
  }

  return node.children.some(
    (child) =>
      child.type === "arrow_function" ||
      child.descendantsOfType?.("arrow_function")?.length > 0
  );
}

export const chunkFileAST = async (
  filePath: string,
  content: string
): Promise<ChunkData[]> => {
  const parser = await initTreeSitter();

  const ext = path.extname(filePath).toLowerCase();

  const language = await getLanguage(ext);

  if (!language) {
    console.warn(
      `No Tree-sitter grammar found for ${ext}. Skipping AST parsing.`
    );
    return []; // Fallback: you could return a single chunk of the whole file here if desired
  }

  parser.setLanguage(language);

  const tree = parser.parse(content);

  const rootNode = tree?.rootNode;

  const chunks: ChunkData[] = [];
  const imports: string[] = [];

  // Extract Imports (Top-level traversal)
  rootNode?.children.forEach((child) => {
    if (child.type.includes("import") || child.type.includes("require")) {
      imports.push(child.text);
    }
  });

  // Traverse and Extract Target Nodes (Functions/Classes)
  function traverse(node: Node) {
    const isTarget =
      TARGET_NODE_TYPES.has(node.type) || isArrowFunctionDeclaration(node);

    if (isTarget) {
      // Large functions (>1000 lines) should eventually be split recursively.

      // For now, we index the entire AST node range. Tree-sitter positions are 0-based.

      const startLine = node.startPosition.row + 1;
      const endLine = node.endPosition.row + 1;

      // Extract signature (first line of the node)
      const signature = node.text.split("\n")[0].trim();

      chunks.push({
        filePath,
        startLine,
        endLine,
        content: node.text,
        signature,
        imports: [...imports], // Copy current imports
      });

      // We don't traverse deeper into this function to avoid nested duplicate chunks
      return;
    }

    for (const child of node.children) {
      traverse(child);
    }
  }

  if (rootNode) {
    traverse(rootNode);
  }

  // Fall back to a single module-level chunk when no functions or classes are found.(e.g config file)

  if (chunks.length === 0 && content.trim().length > 0) {
    chunks.push({
      filePath,
      startLine: 1,
      endLine: content.split("\n").length,
      content,
      signature: `Module: ${path.basename(filePath)}`,
      imports: [...imports],
    });
  }

  return chunks;
};
