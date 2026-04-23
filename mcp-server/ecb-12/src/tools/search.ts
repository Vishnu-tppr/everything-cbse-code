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

function getScope(filePath: string): string {
  if (filePath.startsWith('skills/')) return 'skills';
  if (filePath.startsWith('agents/')) return 'agents';
  if (filePath.startsWith('commands/')) return 'commands';
  if (filePath.startsWith('rules/')) return 'rules';
  if (filePath.startsWith('Prasanna-12/')) return 'notes';
  return 'other';
}

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

function countOccurrences(content: string, query: string): number {
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  let count = 0, pos = 0;
  while (true) {
    pos = lowerContent.indexOf(lowerQuery, pos);
    if (pos === -1) break;
    count++;
    pos += lowerQuery.length;
  }
  return count;
}

export function registerSearchTools(server: McpServer, index: CBSEIndex): void {
  server.tool(
    'search',
    'Full-text search across all indexed 12th Grade markdown files.',
    {
      query: z.string().min(2).describe('Search query. Example: "calculus", "organic mechanism"'),
      scope: z.enum(['skills', 'agents', 'commands', 'rules', 'notes', 'all']).optional(),
    },
    async ({ query, scope }) => {
      const targetScope = scope ?? 'all';
      const results: SearchResult[] = [];
      const files = index.allMarkdownFiles.filter(f => targetScope === 'all' || getScope(f) === targetScope);

      for (const f of files) {
        try {
          const content = safeRead(f);
          const occurrences = countOccurrences(content, query);
          if (occurrences > 0) {
            results.push({ path: f, scope: getScope(f), excerpt: extractExcerpt(content, query), occurrences });
          }
        } catch {}
      }

      results.sort((a, b) => b.occurrences - a.occurrences);
      const topResults = results.slice(0, 10);
      return { content: [{ type: 'text', text: JSON.stringify({ query, scope: targetScope, results: topResults, total: results.length }, null, 2) }] };
    }
  );
}
