/**
 * Agent tools: get_agent
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { safeRead } from '../lib/fs.js';
import type { CBSEIndex } from '../lib/indexer.js';

export function registerAgentTools(server: McpServer, index: CBSEIndex): void {

  // ─── get_agent ───
  server.tool(
    'get_agent',
    'Fetches an agent persona definition with its full system prompt and behavior rules. ' +
    'Available agents: tutor (Socratic teaching), examiner (question generation), ' +
    'evaluator (answer marking), math-step-evaluator (partial credit), ' +
    'case-builder (CBQ scenarios), planner (study schedules), weak-spotter (gap analysis).',
    {
      agent: z.string().describe(
        'Agent name. One of: tutor, examiner, evaluator, math-step-evaluator, case-builder, planner, weak-spotter'
      ),
    },
    async ({ agent }) => {
      const key = agent.toLowerCase().replace(/\s+/g, '-');
      const filePath = index.agents.get(key);

      if (!filePath) {
        const available = Array.from(index.agents.keys()).join(', ');
        return {
          content: [{
            type: 'text',
            text: `Agent "${agent}" not found. Available agents: ${available}`,
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
