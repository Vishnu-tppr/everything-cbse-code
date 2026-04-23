import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { safeRead } from '../lib/fs.js';
import type { CBSEIndex } from '../lib/indexer.js';

export function registerCoreTools(server: McpServer, index: CBSEIndex): void {
  server.tool(
    'get_cbse_index',
    'Returns CBSE12.md — the master map of the CBSE 12th Grade ecosystem. Call this first to understand the system.',
    {},
    async () => {
      try {
        const content = safeRead('CBSE12.md');
        return { content: [{ type: 'text', text: content }] };
      } catch (err) {
        return { content: [{ type: 'text', text: `Error: ${(err as Error).message}` }], isError: true };
      }
    }
  );

  server.tool(
    'get_agents_manifest',
    'Returns AGENTS.md — the orchestration brain for Grade 12 describing persona chaining.',
    {},
    async () => {
      try {
        const content = safeRead('AGENTS.md');
        return { content: [{ type: 'text', text: content }] };
      } catch (err) {
        return { content: [{ type: 'text', text: `Error: ${(err as Error).message}` }], isError: true };
      }
    }
  );

  server.tool(
    'list_all',
    'Returns a structured inventory of all available components (skills, agents, commands, rules, notes).',
    {
      category: z.enum(['skills', 'agents', 'commands', 'rules', 'notes', 'all'])
        .optional()
        .describe('Filter by category. Omit or pass "all" to see everything.'),
    },
    async ({ category }) => {
      const cat = category ?? 'all';
      const result: any = {};
      if (cat === 'all' || cat === 'skills') result.skills = Array.from(index.skills.keys()).sort();
      if (cat === 'all' || cat === 'agents') result.agents = Array.from(index.agents.keys()).sort();
      if (cat === 'all' || cat === 'commands') result.commands = Array.from(index.commands.keys()).sort();
      if (cat === 'all' || cat === 'rules') result.rules = Array.from(index.rules.keys()).sort();
      if (cat === 'all' || cat === 'notes') {
        const subjects: any = {};
        for (const [subj, files] of index.notes.bySubject) subjects[subj] = files.length;
        result.notes = { 
          subjects, 
          hubs: Array.from(index.notes.hubs.keys()).sort(), 
          dashboards: Array.from(index.notes.dashboards.keys()).sort(),
          templates: Array.from(index.notes.templates.keys()).sort()
        };
      }
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    'get_rules',
    'Returns one or all always-active CBSE rule files. Rules govern answer formatting, teaching style, and session hooks.',
    { rule: z.string().optional().describe('Specific rule name. Omit to get all rules concatenated.') },
    async ({ rule }) => {
      try {
        if (rule) {
          const key = rule.toLowerCase().replace(/\s+/g, '-');
          const path = index.rules.get(key);
          if (!path) return { content: [{ type: 'text', text: `Rule "${rule}" not found. Available: ${Array.from(index.rules.keys()).join(', ')}` }], isError: true };
          return { content: [{ type: 'text', text: safeRead(path) }] };
        }
        
        const parts = [];
        for (const [name, path] of index.rules) {
          try { parts.push(`# Rule: ${name}\n\n${safeRead(path)}`); }
          catch { parts.push(`# Rule: ${name}\n\n[Error reading file]`); }
        }
        return { content: [{ type: 'text', text: parts.join('\n\n---\n\n') }] };
      } catch (err) {
        return { content: [{ type: 'text', text: `Error: ${(err as Error).message}` }], isError: true };
      }
    }
  );
}
