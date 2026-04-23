/**
 * Search tool: full-text search across all indexed markdown files.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { safeRead } from '../lib/fs.js';
import type { CBSEIndex } from '../lib/indexer.js';

interface SearchResult {
  path: string;
  scope: string;
  excerpt: string;
  occurrences: number;
}

/** Determine the scope of a file path */
function getScope(filePath: string): string {
  if (filePath.startsWith('skills/')) return 'skills';
  if (filePath.startsWith('agents/')) return 'agents';
  if (filePath.startsWith('commands/')) return 'commands';
  if (filePath.startsWith('rules/')) return 'rules';
  if (filePath.startsWith('Prasanna/')) return 'notes';
  return 'other';
}

/** Extract a 200-char excerpt centred on the first match */
function extractExcerpt(content: string, query: string, contextChars: number = 100): string {
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const matchIndex = lowerContent.indexOf(lowerQuery);

  if (matchIndex === -1) return '';

  const start = Math.max(0, matchIndex - contextChars);
  const end = Math.min(content.length, matchIndex + query.length + contextChars);

  let excerpt = content.slice(start, end).replace(/\n/g, ' ').replace(/\s+/g, ' ');

  if (start > 0) excerpt = '...' + excerpt;
  if (end < content.length) excerpt = excerpt + '...';

  return excerpt;
}

/** Count occurrences of query in content (case-insensitive) */
function countOccurrences(content: string, query: string): number {
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  let count = 0;
  let pos = 0;

  while (true) {
    pos = lowerContent.indexOf(lowerQuery, pos);
    if (pos === -1) break;
    count++;
    pos += lowerQuery.length;
  }

  return count;
}

export function registerSearchTools(server: McpServer, index: CBSEIndex): void {

  // ─── search ───
  server.tool(
    'search',
    'Full-text search across all indexed markdown files in the CBSE ecosystem. ' +
    'Case-insensitive substring match. Use to discover which skill, note, command, or rule ' +
    'contains a specific topic before fetching the full file. Returns top 10 results with excerpts.',
    {
      query: z.string().min(2).describe('Search query. Minimum 2 characters. Example: "assertion reason", "Ohm\'s law", "photosynthesis"'),
      scope: z.enum(['skills', 'agents', 'commands', 'rules', 'notes', 'all'])
        .optional()
        .describe('Limit search to a specific category. Omit or "all" to search everywhere.'),
    },
    async ({ query, scope }) => {
      const targetScope = scope ?? 'all';
      const results: SearchResult[] = [];

      // Filter files by scope
      const filesToSearch = index.allMarkdownFiles.filter(f => {
        if (targetScope === 'all') return true;
        return getScope(f) === targetScope;
      });

      for (const filePath of filesToSearch) {
        try {
          const content = safeRead(filePath);
          const occurrences = countOccurrences(content, query);

          if (occurrences > 0) {
            results.push({
              path: filePath,
              scope: getScope(filePath),
              excerpt: extractExcerpt(content, query),
              occurrences,
            });
          }
        } catch {
          // Skip files that can't be read (shouldn't happen with safeRead)
          continue;
        }
      }

      // Sort by occurrence count descending
      results.sort((a, b) => b.occurrences - a.occurrences);

      const total = results.length;
      const truncated = total > 10;
      const topResults = results.slice(0, 10);

      const output = {
        query,
        scope: targetScope,
        results: topResults,
        ...(truncated ? { truncated: true, total } : { total }),
      };

      return {
        content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
      };
    }
  );
}
