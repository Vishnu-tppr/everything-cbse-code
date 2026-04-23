# CBSE 12th Grade MCP Server

This server provides a bridge between Claude Desktop and the CBSE Grade 12 Board Preparation ecosystem.

## Features
- **Skills Resource**: Browse 40+ subject and strategy skills.
- **Agents Resource**: Activate senior examiner or tutor personas.
- **Notes Resource**: Search and read personal chapter notes from the `Prasanna-12` vault.
- **Master Index**: Quick access to the system map.

## Installation for Claude Desktop

Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "ecc-12": {
      "command": "node",
      "args": [
        "D:/everything-cbse-code/mcp-server/ecc-12/dist/index.js"
      ]
    }
  }
}
```

## Build Instructions
1. `cd mcp-server`
2. `npm install`
3. `npm run build`
