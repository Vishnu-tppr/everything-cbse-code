# 🎓 ECB MCP Servers

This directory contains the Model Context Protocol (MCP) servers for the unified ECB ecosystem. Each grade level has its own dedicated server to provide a specialized experience.

## 📁 Structure

- [**ecb-10/**](./ecb-10/) — MCP server for Grade 10 Board preparation.
- [**ecb-12/**](./ecb-12/) — MCP server for Grade 12 Board preparation.

## 🔗 Connection to Claude Desktop

To use these tools in Claude Desktop, add both to your `claude_desktop_config.json` file.

### Find the config file
Press `Win + R`, paste `%APPDATA%\Claude`, and hit Enter. Look for `claude_desktop_config.json`.

### Add the servers
Add the following to the `mcpServers` object (ensure you use your absolute path):

```json
{
  "mcpServers": {
    "cbse-10th": {
      "command": "node",
      "args": ["D:/everything-cbse-board/mcp-server/ecb-10/dist/index.js"]
    },
    "cbse-12th": {
      "command": "node",
      "args": ["D:/everything-cbse-board/mcp-server/ecb-12/dist/index.js"]
    }
  }
}
```

## 🛠️ Build Instructions

Before running the servers for the first time, you must build them:

```powershell
# For 10th Grade
cd mcp-server/ecb-10
npm install
npm run build

# For 12th Grade
cd ../ecb-12
npm install
npm run build
```

