import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { safeRead } from '../lib/fs.js';
import type { CBSEIndex } from '../lib/indexer.js';

export function registerAgentTools(server: McpServer, index: CBSEIndex): void {
  server.tool(
    'get_agent',
    'Fetches a Grade 12 agent persona definition (Tutor, Examiner, Evaluator, JEE/NEET Drill, etc.).',
    { agent: z.string().describe('Agent name (e.g., "tutor", "examiner", "neet-drill")') },
    async ({ agent }) => {
      const key = agent.toLowerCase().replace(/\s+/g, '-');
      const p = index.agents.get(key);
      if (!p) return { content: [{ type: 'text', text: `Agent not found. Available: ${Array.from(index.agents.keys()).join(', ')}` }], isError: true };
      try { return { content: [{ type: 'text', text: safeRead(p) }] }; }
      catch (err) { return { content: [{ type: 'text', text: `Error: ${(err as Error).message}` }], isError: true }; }
    }
  );
}
