import { Parser, Language } from "web-tree-sitter";
import path from "path";
import fs from "fs/promises";

let parserInstance: Parser | null = null;
const languageCache = new Map<string, Language>();

// Map file extensions to their WASM grammar files
const LANGUAGE_MAP: Record<string, string> = {
  ".ts": "tree-sitter-typescript.wasm",
  ".tsx": "tree-sitter-tsx.wasm",
  ".js": "tree-sitter-javascript.wasm",
  ".jsx": "tree-sitter-javascript.wasm",
  ".py": "tree-sitter-python.wasm",
  ".go": "tree-sitter-go.wasm",
};

export async function initTreeSitter() {
  if (parserInstance) return parserInstance;

  // Initialize the WASM parser
  await Parser.init();
  parserInstance = new Parser();
  return parserInstance;
}

export async function getLanguage(
  ext: string
): Promise<Language | null> {
  const wasmFile = LANGUAGE_MAP[ext];
  if (!wasmFile) return null;

  if (languageCache.has(ext)) return languageCache.get(ext)!;

  // Load the WASM grammar from your local directory
  const wasmPath = path.join(process.cwd(), "lib", "wasm", wasmFile);

  if (
    !(await fs
      .access(wasmPath)
      .then(() => true)
      .catch(() => false))
  ) {
    console.warn(`WASM grammar not found for ${ext} at ${wasmPath}`);
    return null;
  }

  const lang = await Language.load(wasmPath);
  languageCache.set(ext, lang);
  return lang;
}
