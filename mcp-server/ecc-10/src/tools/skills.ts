/**
 * Skill tools: get_skill, get_skills_for_session
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { safeRead } from '../lib/fs.js';
import type { CBSEIndex } from '../lib/indexer.js';

/** Find a skill by name with fuzzy matching */
function resolveSkill(
  query: string,
  skills: Map<string, string>
): { path: string; key: string } | { error: string; options: string[] } {
  const normalised = query.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-');

  // Direct match
  if (skills.has(normalised)) {
    return { path: skills.get(normalised)!, key: normalised };
  }

  // Try without "science-" or "social-science-" prefix for nested skills
  // e.g. "science/physics" → "physics", "social-science/history" → "history"
  const slashNorm = query.toLowerCase().replace(/\s+/g, '-');
  const lastPart = slashNorm.split(/[\/\-]/).pop() ?? '';
  if (lastPart && skills.has(lastPart)) {
    return { path: skills.get(lastPart)!, key: lastPart };
  }

  // Fuzzy: find all keys containing the query
  const matches = Array.from(skills.keys()).filter(
    k => k.includes(normalised) || normalised.includes(k)
  );

  if (matches.length === 1) {
    return { path: skills.get(matches[0])!, key: matches[0] };
  }

  if (matches.length > 1) {
    return { error: `Did you mean one of these?`, options: matches };
  }

  // No match at all
  return {
    error: `Skill "${query}" not found.`,
    options: Array.from(skills.keys()).sort(),
  };
}

export function registerSkillTools(server: McpServer, index: CBSEIndex): void {

  // ─── get_skill ───
  server.tool(
    'get_skill',
    'Fetches a CBSE skill file by subject or skill name. ' +
    'Accepts: subject names ("mathematics", "physics", "history"), ' +
    'strategy skills ("cbq-engine", "mistake-dna", "topper-patterns"), ' +
    'or slash paths ("science/physics", "social-science/economics"). ' +
    'Returns the full SKILL.md content with syllabus, marking scheme, and strategy.',
    {
      skill: z.string().describe(
        'Skill name or subject. Examples: "mathematics", "science/physics", "cbq-engine", "topper-patterns"'
      ),
    },
    async ({ skill }) => {
      const result = resolveSkill(skill, index.skills);

      if ('error' in result) {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ error: result.error, available: result.options }, null, 2),
          }],
          isError: true,
        };
      }

      try {
        const content = safeRead(result.path);
        return { content: [{ type: 'text', text: content }] };
      } catch (err) {
        return {
          content: [{ type: 'text', text: `Error reading ${result.path}: ${(err as Error).message}` }],
          isError: true,
        };
      }
    }
  );

  // ─── get_skills_for_session ───
  server.tool(
    'get_skills_for_session',
    'Batch-loads multiple skills in one call. Use when a session needs 2-3 skills together ' +
    '(e.g., tutor needs subject skill + keyword-bank + ncert-mirror). Max 5 skills per call. ' +
    'Returns per-item results — one failed skill does not block others.',
    {
      skills: z.array(z.string())
        .min(1)
        .max(5)
        .describe('Array of skill names to load. Max 5. Example: ["mathematics", "keyword-bank", "ncert-mirror"]'),
    },
    async ({ skills }) => {
      const results: Array<{ skill: string; content?: string; error?: string }> = [];

      for (const skillName of skills) {
        const resolved = resolveSkill(skillName, index.skills);

        if ('error' in resolved) {
          results.push({
            skill: skillName,
            error: `${resolved.error} Options: ${resolved.options.slice(0, 5).join(', ')}`,
          });
          continue;
        }

        try {
          const content = safeRead(resolved.path);
          results.push({ skill: resolved.key, content });
        } catch (err) {
          results.push({
            skill: skillName,
            error: (err as Error).message,
          });
        }
      }

      // Format output with clear separators
      const outputParts = results.map(r => {
        if (r.error) {
          return `═══ ${r.skill} ═══\n[ERROR] ${r.error}`;
        }
        return `═══ ${r.skill} ═══\n${r.content}`;
      });

      return {
        content: [{ type: 'text', text: outputParts.join('\n\n─────────────────\n\n') }],
      };
    }
  );
}
