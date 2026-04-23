import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { safeRead } from '../lib/fs.js';
import type { CBSEIndex } from '../lib/indexer.js';

export function registerCommandTools(server: McpServer, index: CBSEIndex): void {
  server.tool(
    'get_command',
    'Fetches a Grade 12 command definition.',
    { command: z.string().describe('Command name (e.g., "practice", "explain")') },
    async ({ command }) => {
      const key = command.toLowerCase().replace(/^\//, '').replace(/\s+/g, '-');
      const p = index.commands.get(key);
      if (!p) return { content: [{ type: 'text', text: `Command not found. Available: ${Array.from(index.commands.keys()).join(', ')}` }], isError: true };
      try { return { content: [{ type: 'text', text: safeRead(p) }] }; }
      catch (err) { return { content: [{ type: 'text', text: `Error: ${(err as Error).message}` }], isError: true }; }
    }
  );

  server.tool(
    'run_command',
    'Injects parameters into a command template and returns the instructions.',
    {
      command: z.string(),
      params: z.record(z.string()).describe('e.g., { "subject": "physics", "chapter": "Optics" }'),
    },
    async ({ command, params }) => {
      const key = command.toLowerCase().replace(/^\//, '').replace(/\s+/g, '-');
      const p = index.commands.get(key);
      if (!p) return { content: [{ type: 'text', text: `Command not found.` }], isError: true };
      try {
        let template = safeRead(p);
        for (const [k, v] of Object.entries(params)) {
          template = template.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'gi'), v);
        }
        return { content: [{ type: 'text', text: `[/${command}] Execution Block:\n\n${template}` }] };
      } catch (err) { return { content: [{ type: 'text', text: `Error: ${(err as Error).message}` }], isError: true }; }
    }
  );
}
