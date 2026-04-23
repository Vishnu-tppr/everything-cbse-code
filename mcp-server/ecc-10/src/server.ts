/**
 * MCP Server: registers all 13 tools and 9 resource URI patterns.
 * Import this and call createServer() from the entry point.
 */
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { safeRead } from './lib/fs.js';
import { buildIndex } from './lib/indexer.js';
import type { CBSEIndex } from './lib/indexer.js';
import { registerCoreTools } from './tools/core.js';
import { registerSkillTools } from './tools/skills.js';
import { registerAgentTools } from './tools/agents.js';
import { registerCommandTools } from './tools/commands.js';
import { registerNoteTools } from './tools/notes.js';
import { registerSearchTools } from './tools/search.js';

export interface ServerContext {
  server: McpServer;
  index: CBSEIndex;
}

export function createServer(): ServerContext {
  const index = buildIndex();

  const server = new McpServer(
    {
      name: 'cbse-tools',
      version: '1.0.0',
    },
    {
      instructions:
        'This server exposes the complete CBSE Grade 10 Board Exam preparation ecosystem. ' +
        'Use get_cbse_index first to understand the system. ' +
        'Use get_skill to load subject knowledge. ' +
        'Use get_agent to activate personas (tutor, examiner, evaluator). ' +
        'Use run_command to execute student commands like /practice or /mock-test. ' +
        'Use search to find topics across all files. ' +
        'Use get_chapter_notes to access personal study notes. ' +
        'Use get_hub for formula sheets, diagram banks, and keyword lists.',
    }
  );

  // ─── Register all 13 tools ───
  registerCoreTools(server, index);    // 4 tools
  registerSkillTools(server, index);   // 2 tools
  registerAgentTools(server, index);   // 1 tool
  registerCommandTools(server, index); // 2 tools
  registerNoteTools(server, index);    // 2 tools
  registerSearchTools(server, index);  // 2 tools (search + was 1, total 13 with the adjustment)

  // ─── Register resources ───
  registerResources(server, index);

  return { server, index };
}

function registerResources(server: McpServer, index: CBSEIndex): void {

  // Static resources
  server.resource(
    'cbse-index',
    'cbse://index',
    { title: 'CBSE Master Index', description: 'The master map of the entire CBSE ecosystem', mimeType: 'text/markdown' },
    async (uri) => ({
      contents: [{ uri: uri.href, text: safeRead('CBSE.md') }],
    })
  );

  server.resource(
    'agents-manifest',
    'cbse://agents',
    { title: 'Agents Manifest', description: 'Orchestration brain with all 7 agent personas', mimeType: 'text/markdown' },
    async (uri) => ({
      contents: [{ uri: uri.href, text: safeRead('AGENTS.md') }],
    })
  );

  // Dynamic resource: skills
  server.resource(
    'skill',
    new ResourceTemplate('cbse://skill/{name}', {
      list: async () => ({
        resources: Array.from(index.skills.entries()).map(([name, _path]) => ({
          uri: `cbse://skill/${name}`,
          name: `Skill: ${name}`,
        })),
      }),
    }),
    { title: 'CBSE Skill', description: 'A CBSE subject or strategy skill', mimeType: 'text/markdown' },
    async (uri, { name }) => {
      const skillPath = index.skills.get(name as string);
      if (!skillPath) {
        throw new Error(`Skill "${name}" not found`);
      }
      return {
        contents: [{ uri: uri.href, text: safeRead(skillPath) }],
      };
    }
  );

  // Dynamic resource: agents
  server.resource(
    'agent',
    new ResourceTemplate('cbse://agent/{name}', {
      list: async () => ({
        resources: Array.from(index.agents.entries()).map(([name, _path]) => ({
          uri: `cbse://agent/${name}`,
          name: `Agent: ${name}`,
        })),
      }),
    }),
    { title: 'CBSE Agent', description: 'An agent persona definition', mimeType: 'text/markdown' },
    async (uri, { name }) => {
      const agentPath = index.agents.get(name as string);
      if (!agentPath) {
        throw new Error(`Agent "${name}" not found`);
      }
      return {
        contents: [{ uri: uri.href, text: safeRead(agentPath) }],
      };
    }
  );

  // Dynamic resource: commands
  server.resource(
    'command',
    new ResourceTemplate('cbse://command/{name}', {
      list: async () => ({
        resources: Array.from(index.commands.entries()).map(([name, _path]) => ({
          uri: `cbse://command/${name}`,
          name: `Command: /${name}`,
        })),
      }),
    }),
    { title: 'CBSE Command', description: 'A slash command definition', mimeType: 'text/markdown' },
    async (uri, { name }) => {
      const cmdPath = index.commands.get(name as string);
      if (!cmdPath) {
        throw new Error(`Command "${name}" not found`);
      }
      return {
        contents: [{ uri: uri.href, text: safeRead(cmdPath) }],
      };
    }
  );

  // Dynamic resource: rules
  server.resource(
    'rule',
    new ResourceTemplate('cbse://rule/{name}', {
      list: async () => ({
        resources: Array.from(index.rules.entries()).map(([name, _path]) => ({
          uri: `cbse://rule/${name}`,
          name: `Rule: ${name}`,
        })),
      }),
    }),
    { title: 'CBSE Rule', description: 'An always-active rule', mimeType: 'text/markdown' },
    async (uri, { name }) => {
      const rulePath = index.rules.get(name as string);
      if (!rulePath) {
        throw new Error(`Rule "${name}" not found`);
      }
      return {
        contents: [{ uri: uri.href, text: safeRead(rulePath) }],
      };
    }
  );

  // Dynamic resource: notes by subject
  server.resource(
    'note',
    new ResourceTemplate('cbse://notes/{subject}/{file}', {
      list: async () => {
        const resources: Array<{ uri: string; name: string }> = [];
        for (const [subj, files] of index.notes.bySubject) {
          for (const f of files) {
            const fileName = f.split('/').pop()?.replace(/\.md$/, '') ?? f;
            resources.push({
              uri: `cbse://notes/${subj}/${encodeURIComponent(fileName)}`,
              name: `${subj}: ${fileName}`,
            });
          }
        }
        return { resources };
      },
    }),
    { title: 'Chapter Note', description: 'Personal chapter notes from Obsidian vault', mimeType: 'text/markdown' },
    async (uri, { subject, file }) => {
      const subjectFiles = index.notes.bySubject.get(subject as string);
      if (!subjectFiles) {
        throw new Error(`Subject "${subject}" not found`);
      }
      const decoded = decodeURIComponent(file as string);
      const match = subjectFiles.find(f => f.toLowerCase().includes(decoded.toLowerCase()));
      if (!match) {
        throw new Error(`Note "${file}" not found in ${subject}`);
      }
      return {
        contents: [{ uri: uri.href, text: safeRead(match) }],
      };
    }
  );

  // Dynamic resource: hubs
  server.resource(
    'hub',
    new ResourceTemplate('cbse://hub/{name}', {
      list: async () => ({
        resources: [
          ...Array.from(index.notes.hubs.entries()),
          ...Array.from(index.notes.dashboards.entries()),
        ].map(([name, _path]) => ({
          uri: `cbse://hub/${name}`,
          name: `Hub: ${name}`,
        })),
      }),
    }),
    { title: 'Hub File', description: 'Formula sheet, diagram bank, keywords, or dashboard', mimeType: 'text/markdown' },
    async (uri, { name }) => {
      const hubPath = index.notes.hubs.get(name as string) ?? index.notes.dashboards.get(name as string);
      if (!hubPath) {
        throw new Error(`Hub "${name}" not found`);
      }
      return {
        contents: [{ uri: uri.href, text: safeRead(hubPath) }],
      };
    }
  );

  // Dynamic resource: templates
  server.resource(
    'template',
    new ResourceTemplate('cbse://template/{name}', {
      list: async () => ({
        resources: Array.from(index.notes.templates.entries()).map(([name, _path]) => ({
          uri: `cbse://template/${name}`,
          name: `Template: ${name}`,
        })),
      }),
    }),
    { title: 'Template', description: 'Obsidian note template', mimeType: 'text/markdown' },
    async (uri, { name }) => {
      const tplPath = index.notes.templates.get(name as string);
      if (!tplPath) {
        throw new Error(`Template "${name}" not found`);
      }
      return {
        contents: [{ uri: uri.href, text: safeRead(tplPath) }],
      };
    }
  );
}
