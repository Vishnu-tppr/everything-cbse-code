import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { safeRead } from '../lib/fs.js';
import { resolveSubject } from '../lib/indexer.js';
import type { CBSEIndex } from '../lib/indexer.js';

export function registerNoteTools(server: McpServer, index: CBSEIndex): void {
  server.tool(
    'get_chapter_notes',
    'Fetches personal chapter notes from the Prasanna-12 vault. Omit chapter to list all notes for a subject.',
    {
      subject: z.string().describe('Subject (e.g., "physics", "math", "chemistry", "biology", "computer-science", "english")'),
      chapter: z.string().optional().describe('Fuzzy matched chapter name. Omit to list all available files.'),
    },
    async ({ subject, chapter }) => {
      const folder = resolveSubject(subject);
      if (!folder) return { content: [{ type: 'text', text: `Subject "${subject}" not recognized. Available: Physics, Chemistry, Math, Biology, Computer-Science, English.` }], isError: true };
      
      const subjectKey = folder.toLowerCase();
      const noteFiles = index.notes.bySubject.get(subjectKey);
      if (!noteFiles || noteFiles.length === 0) return { content: [{ type: 'text', text: `No notes found for "${folder}".` }], isError: true };

      if (!chapter) {
        const fileNames = noteFiles.map(f => f.split('/').pop()?.replace(/\.md$/, '')).sort();
        return { content: [{ type: 'text', text: JSON.stringify({ subject: folder, count: fileNames.length, available: fileNames }, null, 2) }] };
      }

      const query = chapter.toLowerCase();
      const match = noteFiles.find(f => f.toLowerCase().includes(query));
      if (!match) {
        const available = noteFiles.map(f => f.split('/').pop()?.replace(/\.md$/, '')).sort();
        return { content: [{ type: 'text', text: `No note matching "${chapter}" in ${folder}. Available:\n${available.join('\n')}` }], isError: true };
      }

      try { return { content: [{ type: 'text', text: safeRead(match) }] }; }
      catch (err) { return { content: [{ type: 'text', text: `Error: ${(err as Error).message}` }], isError: true }; }
    }
  );

  server.tool(
    'get_hub',
    'Fetches a master hub file, dashboard, or template from Prasanna-12 (Formula sheets, Diagram banks, Topper patterns).',
    { hub: z.string().describe('Hub/Dashboard name (e.g., "All Formulas", "Home", "Chapter Note")') },
    async ({ hub }) => {
      const key = hub.toLowerCase().replace(/\s+/g, '-').replace(/\.md$/, '');
      const p = index.notes.hubs.get(key) ?? index.notes.dashboards.get(key) ?? index.notes.templates.get(key);
      if (!p) {
        const all = [...Array.from(index.notes.hubs.keys()), ...Array.from(index.notes.dashboards.keys()), ...Array.from(index.notes.templates.keys())].sort();
        return { content: [{ type: 'text', text: `Hub "${hub}" not found. Available:\n${all.join('\n')}` }], isError: true };
      }
      try { return { content: [{ type: 'text', text: safeRead(p) }] }; }
      catch (err) { return { content: [{ type: 'text', text: `Error: ${(err as Error).message}` }], isError: true }; }
    }
  );
}
