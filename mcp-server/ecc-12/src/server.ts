import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { safeRead } from './lib/fs.js';
import { buildIndex, CBSEIndex } from './lib/indexer.js';
import * as path from 'path';

export interface ServerContext {
  server: McpServer;
  index: CBSEIndex;
}

export function createServer(): ServerContext {
  const index = buildIndex();

  const server = new McpServer(
    {
      name: 'cbse-12th-mcp',
      version: '1.0.0',
    },
    {
      instructions:
        'This server exposes the complete CBSE Grade 12 Board Exam preparation ecosystem (PCMB/PCMC). ' +
        'Use get_cbse_index first to understand the high-density structure. ' +
        'Use get_skill to load deep subject knowledge (Calculus, Organic Chemistry, etc.). ' +
        'Use get_agent to activate specialized personas (tutor, neet-drill, jee-drill). ' +
        'Use run_command to execute student workflows like /practice or /derivation-drill. ' +
        'Use search for full-text lookup across all indexed 12th-grade files. ' +
        'Use get_chapter_notes to access personal study notes from Prasanna-12. ' +
        'Use get_hub for formula sheets, diagram banks, and high-weightage topic lists.',
    }
  );

  // Register All Tools
  registerCoreTools(server, index);
  registerSkillTools(server, index);
  registerAgentTools(server, index);
  registerCommandTools(server, index);
  registerNoteTools(server, index);
  registerSearchTools(server, index);

  // Register All Resources
  registerResources(server, index);

  return { server, index };
}

import { registerCoreTools } from './tools/core.js';
import { registerSkillTools } from './tools/skills.js';
import { registerAgentTools } from './tools/agents.js';
import { registerCommandTools } from './tools/commands.js';
import { registerNoteTools } from './tools/notes.js';
import { registerSearchTools } from './tools/search.js';

function registerResources(server: McpServer, index: CBSEIndex): void {

  // 1. Static Resources
  server.resource('cbse-12-index', 'cbse12://index', 
    { title: 'CBSE 12th Master Index', description: 'Master map of the 12th Grade ecosystem', mimeType: 'text/markdown' }, 
    async (uri) => ({ contents: [{ uri: uri.href, text: safeRead('CBSE12.md') }] }));

  server.resource('agents-manifest', 'cbse12://agents', 
    { title: 'Agents Manifest', description: 'Orchestration brain for Grade 12', mimeType: 'text/markdown' }, 
    async (uri) => ({ contents: [{ uri: uri.href, text: safeRead('AGENTS.md') }] }));

  // 2. Dynamic: Skills
  server.resource('skill', new ResourceTemplate('cbse12://skill/{name}', {
    list: async () => ({
      resources: Array.from(index.skills.entries()).map(([name]) => ({
        uri: `cbse12://skill/${name}`,
        name: `Skill: ${name}`
      }))
    })
  }), { title: 'CBSE 12th Skill', description: 'A subject or strategy skill for 12th boards', mimeType: 'text/markdown' },
  async (uri, { name }) => {
    const p = index.skills.get(name as string);
    if (!p) throw new Error(`Skill ${name} not found`);
    return { contents: [{ uri: uri.href, text: safeRead(p) }] };
  });

  // 3. Dynamic: Agents
  server.resource('agent', new ResourceTemplate('cbse12://agent/{name}', {
    list: async () => ({
      resources: Array.from(index.agents.entries()).map(([name]) => ({
        uri: `cbse12://agent/${name}`,
        name: `Agent: ${name}`
      }))
    })
  }), { title: 'CBSE 12th Agent', description: 'Persona definition for pedagogical assistance', mimeType: 'text/markdown' },
  async (uri, { name }) => {
    const p = index.agents.get(name as string);
    if (!p) throw new Error(`Agent ${name} not found`);
    return { contents: [{ uri: uri.href, text: safeRead(p) }] };
  });

  // 4. Dynamic: Rules
  server.resource('rule', new ResourceTemplate('cbse12://rule/{name}', {
    list: async () => ({
      resources: Array.from(index.rules.entries()).map(([name]) => ({
        uri: `cbse12://rule/${name}`,
        name: `Rule: ${name}`
      }))
    })
  }), { title: 'CBSE 12th Rule', description: 'Always-active pedagogical or formatting rule', mimeType: 'text/markdown' },
  async (uri, { name }) => {
    const p = index.rules.get(name as string);
    if (!p) throw new Error(`Rule ${name} not found`);
    return { contents: [{ uri: uri.href, text: safeRead(p) }] };
  });

  // 5. Dynamic: Commands
  server.resource('command', new ResourceTemplate('cbse12://command/{name}', {
    list: async () => ({
      resources: Array.from(index.commands.entries()).map(([name]) => ({
        uri: `cbse12://command/${name}`,
        name: `Command: /${name}`
      }))
    })
  }), { title: 'CBSE 12th Command', description: 'Slash command definition and workflow', mimeType: 'text/markdown' },
  async (uri, { name }) => {
    const p = index.commands.get(name as string);
    if (!p) throw new Error(`Command ${name} not found`);
    return { contents: [{ uri: uri.href, text: safeRead(p) }] };
  });

  // 6. Dynamic: Notes (Prasanna-12)
  server.resource('note', new ResourceTemplate('cbse12://notes/{subject}/{file}', {
    list: async () => {
      const res: any[] = [];
      for (const [sub, files] of index.notes.bySubject) {
        files.forEach(f => {
          const name = path.basename(f, '.md');
          res.push({ uri: `cbse12://notes/${sub}/${encodeURIComponent(name)}`, name: `${sub}: ${name}` });
        });
      }
      return { resources: res };
    }
  }), { title: 'Prasanna-12 Note', description: 'Chapter-specific study note from vault', mimeType: 'text/markdown' },
  async (uri, { subject, file }) => {
    const files = index.notes.bySubject.get(subject as string);
    if (!files) throw new Error(`Subject ${subject} not found`);
    const decoded = decodeURIComponent(file as string);
    const match = files.find(f => f.toLowerCase().includes(decoded.toLowerCase()));
    if (!match) throw new Error(`Note ${file} not found in ${subject}`);
    return { contents: [{ uri: uri.href, text: safeRead(match) }] };
  });

  // 7. Dynamic: Hubs & Dashboards
  server.resource('hub', new ResourceTemplate('cbse12://hub/{name}', {
    list: async () => ({
      resources: [
        ...Array.from(index.notes.hubs.entries()),
        ...Array.from(index.notes.dashboards.entries())
      ].map(([name]) => ({ uri: `cbse12://hub/${name}`, name: `Hub: ${name}` }))
    })
  }), { title: '12th Mastery Hub', description: 'Formula sheets, diagram banks, and dashboards', mimeType: 'text/markdown' },
  async (uri, { name }) => {
    const p = index.notes.hubs.get(name as string) ?? index.notes.dashboards.get(name as string);
    if (!p) throw new Error(`Hub ${name} not found`);
    return { contents: [{ uri: uri.href, text: safeRead(p) }] };
  });
}
