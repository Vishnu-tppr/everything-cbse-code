import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { safeRead } from '../lib/fs.js';
import type { CBSEIndex } from '../lib/indexer.js';

function resolveSkill(query: string, skills: Map<string, string>): { path: string; key: string } | { error: string; options: string[] } {
  const norm = query.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-');
  if (skills.has(norm)) return { path: skills.get(norm)!, key: norm };
  
  // Try matching last part
  const lastPart = query.toLowerCase().split(/[\/\-]/).pop() ?? '';
  if (lastPart && skills.has(lastPart)) return { path: skills.get(lastPart)!, key: lastPart };

  const matches = Array.from(skills.keys()).filter(k => k.includes(norm) || norm.includes(k));
  if (matches.length === 1) return { path: skills.get(matches[0])!, key: matches[0] };
  if (matches.length > 1) return { error: `Ambiguous match. Did you mean one of these?`, options: matches };
  
  return { error: `Skill "${query}" not found.`, options: Array.from(skills.keys()).sort() };
}

export function registerSkillTools(server: McpServer, index: CBSEIndex): void {
  server.tool(
    'get_skill',
    'Fetches a Grade 12 skill file by subject or name. Use for subject depth or strategy frameworks.',
    { skill: z.string().describe('Skill/subject name (e.g., "physics", "cbq-engine")') },
    async ({ skill }) => {
      const res = resolveSkill(skill, index.skills);
      if ('error' in res) return { content: [{ type: 'text', text: JSON.stringify({ error: res.error, available: res.options.slice(0, 10) }, null, 2) }], isError: true };
      try { return { content: [{ type: 'text', text: safeRead(res.path) }] }; }
      catch (err) { return { content: [{ type: 'text', text: `Error reading ${res.path}: ${(err as Error).message}` }], isError: true }; }
    }
  );

  server.tool(
    'get_skills_for_session',
    'Batch-loads multiple 12th Grade skills (max 5). Ideal for multi-agent context initialization.',
    { skills: z.array(z.string()).min(1).max(5).describe('Array of skill names.') },
    async ({ skills }) => {
      const parts = [];
      for (const s of skills) {
        const res = resolveSkill(s, index.skills);
        if ('error' in res) parts.push(`═══ ${s} ═══\n[ERROR] ${res.error}`);
        else {
          try { parts.push(`═══ ${res.key} ═══\n${safeRead(res.path)}`); }
          catch (e) { parts.push(`═══ ${s} ═══\n[ERROR] ${(e as Error).message}`); }
        }
      }
      return { content: [{ type: 'text', text: parts.join('\n\n─────────────────\n\n') }] };
    }
  );
}
