import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve REPO_ROOT: everything-cbse-board/mcp-server/ecb-12/src/lib/fs.ts → up 4 levels, then into 12th/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '12th');

// Validate marker file
const markerFile = path.join(REPO_ROOT, 'CBSE12.md');
if (!fs.existsSync(markerFile)) {
  process.stderr.write(
    `[cbse-12th-mcp] FATAL: REPO_ROOT does not contain CBSE12.md.\n` +
    `  Resolved to: ${REPO_ROOT}\n` +
    `  Expected marker file: ${markerFile}\n` +
    `  Fix: ensure mcp-server/ecb-12 is inside everything-cbse-board/mcp-server/\n`
  );
  process.exit(1);
}

export function safeRead(relativePath: string): string {
  const resolved = path.isAbsolute(relativePath) ? relativePath : path.resolve(REPO_ROOT, relativePath);

  if (!resolved.startsWith(REPO_ROOT + path.sep) && resolved !== REPO_ROOT) {
    throw new Error(`[SECURITY] Path traversal blocked: "${relativePath}"`);
  }

  if (resolved.includes('.obsidian')) {
    throw new Error(`[SECURITY] Obsidian internals are inaccessible: "${relativePath}"`);
  }

  if (!fs.existsSync(resolved)) {
    throw new Error(`[NOT FOUND] "${relativePath}" does not exist`);
  }

  return fs.readFileSync(resolved, 'utf-8');
}

export function safeListDir(relativePath: string): string[] {
  const resolved = path.isAbsolute(relativePath) ? relativePath : path.resolve(REPO_ROOT, relativePath);

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

export function safeIsDir(relativePath: string): boolean {
  const resolved = path.isAbsolute(relativePath) ? relativePath : path.resolve(REPO_ROOT, relativePath);
  if (!resolved.startsWith(REPO_ROOT + path.sep) && resolved !== REPO_ROOT) {
    return false;
  }
  return fs.existsSync(resolved) && fs.statSync(resolved).isDirectory();
}

