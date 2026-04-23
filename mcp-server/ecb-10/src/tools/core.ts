/**
 * Core tools: system orientation and overview.
 * get_cbse_index, get_agents_manifest, list_all, get_rules
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { safeRead } from '../lib/fs.js';
import type { CBSEIndex } from '../lib/indexer.js';

export function registerCoreTools(server: McpServer, index: CBSEIndex): void {

  // ─── get_cbse_index ───
  server.tool(
    'get_cbse_index',
    'Returns CBSE.md — the master map of the entire CBSE preparation ecosystem. ' +
    'Call this first to understand the system structure, available subjects, and how components connect.',
    {},
    async () => {
      try {
        const content = safeRead('CBSE.md');
        return { content: [{ type: 'text', text: content }] };
      } catch (err) {
        return {
          content: [{ type: 'text', text: `Error: ${(err as Error).message}` }],
          isError: true,
        };
      }
    }
  );

  // ─── get_agents_manifest ───
  server.tool(
    'get_agents_manifest',
    'Returns AGENTS.md — the orchestration brain describing all 7 agent personas ' +
    '(Tutor, Examiner, Evaluator, Planner, etc.) and how they chain together automatically.',
    {},
    async () => {
      try {
        const content = safeRead('AGENTS.md');
        return { content: [{ type: 'text', text: content }] };
      } catch (err) {
        return {
          content: [{ type: 'text', text: `Error: ${(err as Error).message}` }],
          isError: true,
        };
      }
    }
  );

  // ─── list_all ───
  server.tool(
    'list_all',
    'Returns a structured inventory of all available components by category. ' +
    'Use to discover what skills, agents, commands, rules, or notes exist before fetching them.',
    {
      category: z.enum(['skills', 'agents', 'commands', 'rules', 'notes', 'all'])
        .optional()
        .describe('Filter by category. Omit or pass "all" to see everything.'),
    },
    async ({ category }) => {
      const cat = category ?? 'all';
      const result: Record<string, unknown> = {};

      if (cat === 'all' || cat === 'skills') {
        result.skills = Array.from(index.skills.keys()).sort();
      }
      if (cat === 'all' || cat === 'agents') {
        result.agents = Array.from(index.agents.keys()).sort();
      }
      if (cat === 'all' || cat === 'commands') {
        result.commands = Array.from(index.commands.keys()).sort();
      }
      if (cat === 'all' || cat === 'rules') {
        result.rules = Array.from(index.rules.keys()).sort();
      }
      if (cat === 'all' || cat === 'notes') {
        const subjects: Record<string, number> = {};
        for (const [subj, files] of index.notes.bySubject) {
          subjects[subj] = files.length;
        }
        result.notes = {
          subjects,
          hubs: Array.from(index.notes.hubs.keys()).sort(),
          dashboards: Array.from(index.notes.dashboards.keys()).sort(),
          templates: Array.from(index.notes.templates.keys()).sort(),
        };
      }

      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ─── get_rules ───
  server.tool(
    'get_rules',
    'Returns one or all always-active CBSE rule files. Rules govern answer formatting, ' +
    'teaching style, word budgets, session hooks, and subject detection. ' +
    'If no rule name is specified, returns all rules concatenated.',
    {
      rule: z.string()
        .optional()
        .describe('Specific rule name (e.g. "accuracy", "answer-format", "word-budget"). Omit to get all rules.'),
    },
    async ({ rule }) => {
      try {
        if (rule) {
          const key = rule.toLowerCase().replace(/\s+/g, '-');
          const filePath = index.rules.get(key);
          if (!filePath) {
            const available = Array.from(index.rules.keys()).join(', ');
            return {
              content: [{ type: 'text', text: `Rule "${rule}" not found. Available: ${available}` }],
              isError: true,
            };
          }
          const content = safeRead(filePath);
          return { content: [{ type: 'text', text: content }] };
        }

        // Return all rules concatenated
        const parts: string[] = [];
        for (const [name, filePath] of index.rules) {
          try {
            const content = safeRead(filePath);
            parts.push(`# ═══ Rule: ${name} ═══\n\n${content}`);
          } catch {
            parts.push(`# ═══ Rule: ${name} ═══\n\n[Error reading file]`);
          }
        }

        return {
          content: [{ type: 'text', text: parts.join('\n\n---\n\n') }],
        };
      } catch (err) {
        return {
          content: [{ type: 'text', text: `Error: ${(err as Error).message}` }],
          isError: true,
        };
      }
    }
  );
}
