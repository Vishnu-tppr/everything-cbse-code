/**
 * Safe filesystem access layer.
 * ALL file reads in the entire project MUST go through safeRead/safeListDir.
 * Never use fs.readFileSync directly.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve REPO_ROOT: everything-cbse-board/mcp-server/ecb-10/src/lib/fs.ts → up 4 levels, then into 10th/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '10th');

// Validate on module load — fail fast if path is wrong
const markerFile = path.join(REPO_ROOT, 'CBSE.md');
if (!fs.existsSync(markerFile)) {
  process.stderr.write(
    `[cbse-10th-mcp] FATAL: REPO_ROOT does not contain CBSE.md.\n` +
    `  Resolved to: ${REPO_ROOT}\n` +
    `  Expected marker file: ${markerFile}\n` +
    `  Fix: ensure mcp-server/ecb-10 is inside everything-cbse-board/mcp-server/\n`
  );
  process.exit(1);
}

/**
 * Read a file safely, blocking path traversal and .obsidian access.
 * @param relativePath — path relative to REPO_ROOT (cbse-tools/)
 * @returns file content as UTF-8 string
 * @throws on traversal, .obsidian access, or missing file
 */
export function safeRead(relativePath: string): string {
  const resolved = path.resolve(REPO_ROOT, relativePath);

  // Block path traversal: resolved must be strictly inside REPO_ROOT
  if (!resolved.startsWith(REPO_ROOT + path.sep) && resolved !== REPO_ROOT) {
    throw new Error(`[SECURITY] Path traversal blocked: "${relativePath}"`);
  }

  // Block Obsidian internals
  if (resolved.includes('.obsidian')) {
    throw new Error(`[SECURITY] Obsidian internals are inaccessible: "${relativePath}"`);
  }

  if (!fs.existsSync(resolved)) {
    throw new Error(`[NOT FOUND] "${relativePath}" does not exist (resolved: ${resolved})`);
  }

  return fs.readFileSync(resolved, 'utf-8');
}

/**
 * List directory contents safely with the same guards.
 * @param relativePath — path relative to REPO_ROOT
 * @returns array of entry names (files and dirs), excluding hidden entries
 */
export function safeListDir(relativePath: string): string[] {
  const resolved = path.resolve(REPO_ROOT, relativePath);

  if (!resolved.startsWith(REPO_ROOT + path.sep) && resolved !== REPO_ROOT) {
    throw new Error(`[SECURITY] Path traversal blocked: "${relativePath}"`);
  }

  if (resolved.includes('.obsidian')) {
    throw new Error(`[SECURITY] Obsidian internals are inaccessible: "${relativePath}"`);
  }

  if (!fs.existsSync(resolved)) {
    return [];
  }

  return fs.readdirSync(resolved).filter(entry => !entry.startsWith('.'));
}

/**
 * Check if a path exists safely.
 */
export function safeExists(relativePath: string): boolean {
  const resolved = path.resolve(REPO_ROOT, relativePath);
  if (!resolved.startsWith(REPO_ROOT + path.sep) && resolved !== REPO_ROOT) {
    return false;
  }
  if (resolved.includes('.obsidian')) {
    return false;
  }
  return fs.existsSync(resolved);
}

/**
 * Check if a safe path points to a directory.
 */
export function safeIsDir(relativePath: string): boolean {
  const resolved = path.resolve(REPO_ROOT, relativePath);
  if (!resolved.startsWith(REPO_ROOT + path.sep) && resolved !== REPO_ROOT) {
    return false;
  }
  if (!fs.existsSync(resolved)) {
    return false;
  }
  return fs.statSync(resolved).isDirectory();
}

