/**
 * Command tools: get_command, run_command
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { safeRead } from '../lib/fs.js';
import type { CBSEIndex } from '../lib/indexer.js';

export function registerCommandTools(server: McpServer, index: CBSEIndex): void {

  // ─── get_command ───
  server.tool(
    'get_command',
    'Fetches a CBSE command definition with its parameters, workflow, and chaining rules. ' +
    'Commands are slash-commands the student can invoke: /practice, /explain, /mock-test, ' +
    '/mark-my-answer, /cbq-practice, /warm-up, /map-drill, /exam-hall, etc.',
    {
      command: z.string().describe(
        'Command name without the slash. Example: "practice", "cbq-practice", "mark-my-answer"'
      ),
    },
    async ({ command }) => {
      const key = command.toLowerCase().replace(/^\//, '').replace(/\s+/g, '-');
      const filePath = index.commands.get(key);

      if (!filePath) {
        const available = Array.from(index.commands.keys()).join(', ');
        return {
          content: [{
            type: 'text',
            text: `Command "${command}" not found. Available commands: ${available}`,
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

  // ─── run_command ───
  server.tool(
    'run_command',
    'Loads a command template, injects user-supplied parameters, and returns the expanded ' +
    'instruction block ready for execution. Use this to execute commands with specific parameters ' +
    'like subject, chapter, difficulty, and count.',
    {
      command: z.string().describe('Command name without slash. Example: "practice"'),
      params: z.record(z.string()).describe(
        'Key-value pairs to inject. Example: { "subject": "mathematics", "chapter": "Polynomials", "difficulty": "hard", "count": "5" }'
      ),
    },
    async ({ command, params }) => {
      const key = command.toLowerCase().replace(/^\//, '').replace(/\s+/g, '-');
      const filePath = index.commands.get(key);

      if (!filePath) {
        const available = Array.from(index.commands.keys()).join(', ');
        return {
          content: [{
            type: 'text',
            text: `Command "${command}" not found. Available: ${available}`,
          }],
          isError: true,
        };
      }

      try {
        let template = safeRead(filePath);

        // Simple {{key}} → value substitution
        for (const [paramKey, paramValue] of Object.entries(params)) {
          const placeholder = new RegExp(`\\{\\{${paramKey}\\}\\}`, 'gi');
          template = template.replace(placeholder, paramValue);
        }

        // Build parameter summary
        const paramSummary = Object.entries(params)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ');

        const output =
          `══════════════════════════════════════\n` +
          `Executing /${command} with: ${paramSummary}\n` +
          `══════════════════════════════════════\n\n` +
          `${template}\n\n` +
          `══════════════════════════════════════\n` +
          `Parameters applied: ${JSON.stringify(params)}`;

        return { content: [{ type: 'text', text: output }] };
      } catch (err) {
        return {
          content: [{ type: 'text', text: `Error: ${(err as Error).message}` }],
          isError: true,
        };
      }
    }
  );
}
