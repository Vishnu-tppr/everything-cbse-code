import { createServer } from './server.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

async function main() {
  const { server } = createServer();
  const transport = new StdioServerTransport();
  
  await server.connect(transport);
  console.error('CBSE 12th MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
