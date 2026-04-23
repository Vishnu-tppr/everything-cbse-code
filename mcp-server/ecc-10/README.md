# 🎓 CBSE Tools MCP Server

> Your entire CBSE Grade 10 preparation ecosystem — available directly inside Claude Desktop.
> 49 skills, 7 agents, 20 commands, 8 rules, and your personal Obsidian notes — all on-demand.

---

## ⚡ Prerequisites

You need **Node.js 18 or newer** installed. If you don't have it:
1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the **LTS** version (the big green button)
3. Install it (just click Next through everything)
4. Restart your computer

To check if Node.js is installed, open PowerShell and type:
```
node --version
```
If it shows `v18.x.x` or higher, you're good!

---

## 🔧 Setup (3 steps, copy-paste each)

Open **PowerShell** and run these one by one:

```powershell
# Step 1: Go to the MCP server folder
cd D:\everything-cbse-code\mcp-server\ecc-10

# Step 2: Install dependencies (only needed once)
npm install

# Step 3: Build the server (run after any code changes)
npm run build
```

If all three commands work without red errors, you're ready!

---

## 🔗 Connect to Claude Desktop

### Find the config file

Press `Win + R`, paste this path, and hit Enter:
```
%APPDATA%\Claude
```

Look for a file called `claude_desktop_config.json`. If it doesn't exist, create it.

### Add this to the config file

Open `claude_desktop_config.json` in Notepad and set it to:

```json
{
  "mcpServers": {
    "ecc-10": {
      "command": "node",
      "args": ["D:\\everything-cbse-code\\mcp-server\\ecc-10\\dist\\index.js"]
    }
  }
}
```

> ⚠️ **Important:** Use double backslashes `\\` in the path. If you already have other MCP servers, add `cbse-tools` inside the existing `mcpServers` object.

### Verify it works

1. **Restart Claude Desktop** completely (close it, wait 5 seconds, open it again)
2. Look for the **hammer icon** 🔨 in the bottom-left of the chat input
3. Click it — you should see **cbse-tools** listed with 13 tools
4. If you don't see it, check the path in the config file

---

## 💬 What to Say to Claude (Copy-Paste These!)

### 📚 Study & Practice
```
Use ecc-10: get the mathematics skill and explain Polynomials step by step
```
```
Use ecc-10: load the examiner agent and run the practice command for Science/Physics, chapter Electricity, 5 hard questions
```
```
Use ecc-10: get the cbq-engine skill and give me 3 CBQ practice questions on Carbon Compounds
```

### ✍️ Answer Practice
```
Use ecc-10: load the evaluator agent and run mark-my-answer — question: [paste your question], my answer: [paste your answer]
```
```
Use ecc-10: get the topper-patterns skill and show me how to write a perfect 5-mark Science answer
```

### 📅 Planning & Revision
```
Use ecc-10: load the planner agent and build a revision plan — exam is March 15, weak chapters: Heredity, Carbon Compounds, Globalisation
```
```
Use ecc-10: get All Formulas hub and quiz me on Physics formulas
```

### 🔍 Search & Explore
```
Use ecc-10: search for "Ohm's law" across everything and explain what you find
```
```
Use ecc-10: load my Math notes on Polynomials and the keyword-bank skill, then quiz me
```

---

## 🛠️ All 13 Tools

| # | Tool | What It Does | What You Say to Claude |
|---|------|-------------|----------------------|
| 1 | `get_cbse_index` | Shows the master map of everything | "Show me what CBSE tools are available" |
| 2 | `get_agents_manifest` | Shows all 7 agent personas | "What agents can you use?" |
| 3 | `list_all` | Lists all skills/agents/commands/rules | "List all available skills" |
| 4 | `get_rules` | Gets teaching/formatting rules | "What rules do you follow for answers?" |
| 5 | `get_skill` | Loads a subject or strategy skill | "Get the physics skill" |
| 6 | `get_skills_for_session` | Loads multiple skills at once | "Load math, keyword-bank, and formula-sheet" |
| 7 | `get_agent` | Activates an agent persona | "Load the examiner agent" |
| 8 | `get_command` | Shows a command definition | "Show me the mock-test command" |
| 9 | `run_command` | Executes a command with parameters | "Run practice for chemistry, hard, 5 questions" |
| 10 | `get_chapter_notes` | Gets your personal Obsidian notes | "Get my notes on Quadratic Equations" |
| 11 | `get_hub` | Gets formulas, diagrams, keywords | "Get All Formulas" |
| 12 | `search` | Searches across all files | "Search for photosynthesis" |
| 13 | — | *(12 tools total, plus resources)* | — |

---

## 📊 What's Inside

| Category | Count | Examples |
|----------|-------|---------|
| **Skills** | 49 | Mathematics, Physics, Chemistry, Biology, History, CBQ Engine, Topper Patterns, Mistake DNA... |
| **Agents** | 7 | Tutor, Examiner, Evaluator, Math Step Evaluator, Case Builder, Planner, Weak Spotter |
| **Commands** | 20 | /practice, /explain, /mock-test, /mark-my-answer, /cbq-practice, /revision-plan, /exam-hall... |
| **Rules** | 8 | Answer format, word budget, teaching style, accuracy, subject detection... |
| **Your Notes** | 91+ | All your Obsidian chapter notes, formulas, diagrams, keywords |

---

## ❓ Troubleshooting

| Problem | Fix |
|---------|-----|
| Hammer icon 🔨 not showing | Restart Claude Desktop. Check the path in config uses `\\` |
| "cbse-tools" not listed | Make sure `npm run build` worked. Check if `dist/index.js` exists |
| "REPO_ROOT does not contain CBSE.md" | The path to cbse-tools is wrong. Check the `args` path in config |
| Tool returns "not found" | Check the exact name. Use `list_all` to see all available names |
| Nothing happens | Open PowerShell, run `node D:\Ai-skills\cbse-tools\mcp-server\dist\index.js` and check for errors |

---

## 🏗️ For Developers

```bash
# Run in development mode (no build needed)
npm run dev

# Inspect with MCP Inspector (debug tool)
npm run inspect

# Rebuild after code changes
npm run build
```

### Architecture

```
src/
├── index.ts          ← Entry point (stdio transport)
├── server.ts         ← Wires all tools + resources
├── lib/
│   ├── fs.ts         ← Safe file reader (blocks path traversal)
│   └── indexer.ts    ← Scans repo on startup, builds Maps
└── tools/
    ├── core.ts       ← get_cbse_index, list_all, get_rules
    ├── skills.ts     ← get_skill, get_skills_for_session
    ├── agents.ts     ← get_agent
    ├── commands.ts   ← get_command, run_command
    ├── notes.ts      ← get_chapter_notes, get_hub
    └── search.ts     ← full-text search
```
