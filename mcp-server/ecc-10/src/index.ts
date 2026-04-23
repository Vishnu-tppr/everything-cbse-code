/**
 * cbse-tools-mcp — Entry Point
 * 
 * Stdio transport for Claude Desktop integration.
 * All logging goes to stderr. stdout is reserved for MCP wire protocol.
 */
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';

async function main(): Promise<void> {
  try {
    // Build index and register all tools + resources
    const { server } = createServer();

    // Connect via stdio transport
    const transport = new StdioServerTransport();
    await server.connect(transport);

    process.stderr.write('[cbse-tools-mcp] Ready. 13 tools | 9 resources | Connected via stdio.\n');

    // Graceful shutdown
    process.on('SIGINT', async () => {
      process.stderr.write('[cbse-tools-mcp] Shutting down...\n');
      await server.close();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await server.close();
      process.exit(0);
    });

  } catch (err) {
    process.stderr.write(`[cbse-tools-mcp] FATAL: ${(err as Error).message}\n`);
    process.exit(1);
  }
}

main();
