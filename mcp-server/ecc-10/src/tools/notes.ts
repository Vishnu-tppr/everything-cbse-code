/**
 * Notes tools: get_chapter_notes, get_hub
 * Accesses Prasanna's personal Obsidian knowledge base.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { safeRead } from '../lib/fs.js';
import { resolveSubject } from '../lib/indexer.js';
import type { CBSEIndex } from '../lib/indexer.js';

export function registerNoteTools(server: McpServer, index: CBSEIndex): void {

  // ─── get_chapter_notes ───
  server.tool(
    'get_chapter_notes',
    'Fetches Prasanna\'s personal chapter notes from his Obsidian vault. ' +
    'If no chapter is specified, returns a list of all available note files for that subject. ' +
    'If a chapter is specified, returns the note content. ' +
    'Subjects: Math (14 notes), English (34), Science (13), SST (22), Tamil (8).',
    {
      subject: z.string().describe(
        'Subject name. Accepts: "math", "maths", "mathematics", "science", "english", "sst", "social-science", "tamil"'
      ),
      chapter: z.string().optional().describe(
        'Chapter name (fuzzy matched). Example: "Polynomials", "Electricity", "Nationalism". Omit to list all notes.'
      ),
    },
    async ({ subject, chapter }) => {
      const folder = resolveSubject(subject);

      if (!folder) {
        const available = ['Math', 'Science', 'English', 'SST', 'Tamil'];
        return {
          content: [{
            type: 'text',
            text: `Subject "${subject}" not recognized. Available: ${available.join(', ')}`,
          }],
          isError: true,
        };
      }

      const subjectKey = folder.toLowerCase();
      const noteFiles = index.notes.bySubject.get(subjectKey);

      if (!noteFiles || noteFiles.length === 0) {
        return {
          content: [{ type: 'text', text: `No notes found for "${folder}".` }],
          isError: true,
        };
      }

      // If no chapter specified, return file listing
      if (!chapter) {
        const fileNames = noteFiles.map(f => {
          const parts = f.split('/');
          return parts[parts.length - 1].replace(/\.md$/, '');
        });

        const output = {
          subject: folder,
          noteCount: fileNames.length,
          available: fileNames.sort(),
        };

        return {
          content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
        };
      }

      // Fuzzy match chapter name against file paths
      const query = chapter.toLowerCase();
      const matches = noteFiles.filter(f => f.toLowerCase().includes(query));

      if (matches.length === 0) {
        const available = noteFiles.map(f => {
          const parts = f.split('/');
          return parts[parts.length - 1].replace(/\.md$/, '');
        });
        return {
          content: [{
            type: 'text',
            text: `No note matching "${chapter}" in ${folder}. Available:\n${available.sort().join('\n')}`,
          }],
          isError: true,
        };
      }

      // If multiple matches, return the closest one (shortest path containing query)
      const bestMatch = matches.sort((a, b) => a.length - b.length)[0];

      try {
        const content = safeRead(bestMatch);
        return { content: [{ type: 'text', text: content }] };
      } catch (err) {
        return {
          content: [{ type: 'text', text: `Error: ${(err as Error).message}` }],
          isError: true,
        };
      }
    }
  );

  // ─── get_hub ───
  server.tool(
    'get_hub',
    'Fetches one of Prasanna\'s master hub files, subject dashboards, or templates. ' +
    'Hubs: "All Formulas", "All Diagrams", "Keywords Bank", "Topper Answer Patterns". ' +
    'Dashboards: "Home", "Mathematics", "Science", "English", "Tamil", "Social Science", "Strategy Hub". ' +
    'Templates: "Chapter Note", "Daily Study Log", "Exam Strategy", "Formula Card", "Mistake Entry".',
    {
      hub: z.string().describe(
        'Hub/dashboard/template name. Examples: "All Formulas", "Home", "Strategy Hub", "Chapter Note"'
      ),
    },
    async ({ hub }) => {
      const key = hub.toLowerCase().replace(/\s+/g, '-').replace(/\.md$/, '');

      // Check hubs first, then dashboards, then templates
      const filePath =
        index.notes.hubs.get(key) ??
        index.notes.dashboards.get(key) ??
        index.notes.templates.get(key);

      if (!filePath) {
        const allAvailable = [
          ...Array.from(index.notes.hubs.keys()),
          ...Array.from(index.notes.dashboards.keys()),
          ...Array.from(index.notes.templates.keys()),
        ].sort();

        return {
          content: [{
            type: 'text',
            text: `Hub "${hub}" not found. Available:\n${allAvailable.join('\n')}`,
          }],
          isError: true,
        };
      }

      try {
        const content = safeRead(filePath);
        return { content: [{ type: 'text', text: content }] };
      } catch (err) {
        return {
          content: [{ type: 'text', text: `Error: ${(err as Error).message}` }],
          isError: true,
        };
      }
    }
  );
}
