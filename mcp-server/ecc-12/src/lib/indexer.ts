import * as path from 'node:path';
import { safeListDir, safeIsDir } from './fs.js';
import * as fs from 'node:fs';
import { REPO_ROOT } from './fs.js';

export interface CBSEIndex {
  skills: Map<string, string>;
  agents: Map<string, string>;
  commands: Map<string, string>;
  rules: Map<string, string>;
  notes: {
    bySubject: Map<string, string[]>;
    hubs: Map<string, string>;
    dashboards: Map<string, string>;
    templates: Map<string, string>;
  };
  allMarkdownFiles: string[];
}

function toKebab(name: string): string {
  return name
    .replace(/\.md$/i, '')
    .replace(/[^\p{L}\p{N}\s\-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase();
}

const SUBJECT_ALIASES: Record<string, string> = {
  'physics': 'Physics',
  'chemistry': 'Chemistry',
  'math': 'Mathematics',
  'maths': 'Mathematics',
  'mathematics': 'Mathematics',
  'biology': 'Biology',
  'cs': 'Computer-Science',
  'computer-science': 'Computer-Science',
  'english': 'English',
};

const HUB_FILES = [
  'All Diagrams.md',
  'All Formulas.md',
  'All Derivations.md',
  'Keywords Bank.md',
  'Topper Answer Patterns.md',
];

const DASHBOARD_FILES = [
  '🏠 Home.md',
  '🔬 Physics.md',
  '🧪 Chemistry.md',
  '📘 Mathematics.md',
  '🌿 Biology.md',
  '💻 Computer Science.md',
  '📖 English.md',
  '🎯 Strategy Hub.md',
];

export function buildIndex(): CBSEIndex {
  const index: CBSEIndex = {
    skills: new Map(),
    agents: new Map(),
    commands: new Map(),
    rules: new Map(),
    notes: {
      bySubject: new Map(),
      hubs: new Map(),
      dashboards: new Map(),
      templates: new Map(),
    },
    allMarkdownFiles: [],
  };

  const prasannaDir = 'Prasanna-12';

  // Index Skills
  const skillsDir = path.join(REPO_ROOT, 'skills');
  if (fs.existsSync(skillsDir)) {
    const scanSkills = (dir: string) => {
      const entries = fs.readdirSync(dir);
      for (const entry of entries) {
        const entryPath = path.join(dir, entry);
        if (fs.statSync(entryPath).isDirectory()) {
          const skillFile = path.join(entryPath, 'SKILL.md');
          if (fs.existsSync(skillFile)) {
            index.skills.set(toKebab(entry), path.relative(REPO_ROOT, skillFile).replace(/\\/g, '/'));
          }
          scanSkills(entryPath);
        }
      }
    };
    scanSkills(skillsDir);
  }

  // Index Agents
  const agentsDir = path.join(REPO_ROOT, 'agents');
  if (fs.existsSync(agentsDir)) {
    fs.readdirSync(agentsDir).forEach(file => {
      if (file.endsWith('.md')) {
        index.agents.set(toKebab(file), `agents/${file}`);
      }
    });
  }

  // Index Commands
  const commandsDir = path.join(REPO_ROOT, 'commands');
  if (fs.existsSync(commandsDir)) {
    fs.readdirSync(commandsDir).forEach(file => {
      if (file.endsWith('.md')) {
        index.commands.set(toKebab(file), `commands/${file}`);
      }
    });
  }

  // Index Rules
  const rulesDir = path.join(REPO_ROOT, 'rules');
  if (fs.existsSync(rulesDir)) {
    fs.readdirSync(rulesDir).forEach(file => {
      if (file.endsWith('.md')) {
        index.rules.set(toKebab(file), `rules/${file}`);
      }
    });
  }

  // Index Notes
  const fullPrasannaPath = path.join(REPO_ROOT, prasannaDir);
  if (fs.existsSync(fullPrasannaPath)) {
    HUB_FILES.forEach(file => {
      const p = path.join(fullPrasannaPath, file);
      if (fs.existsSync(p)) index.notes.hubs.set(toKebab(file), `${prasannaDir}/${file}`);
    });
    DASHBOARD_FILES.forEach(file => {
      const p = path.join(fullPrasannaPath, file);
      if (fs.existsSync(p)) index.notes.dashboards.set(toKebab(file), `${prasannaDir}/${file}`);
    });

    const templatesDir = path.join(fullPrasannaPath, 'Templates');
    if (fs.existsSync(templatesDir)) {
      fs.readdirSync(templatesDir).forEach(file => {
        if (file.endsWith('.md')) index.notes.templates.set(toKebab(file), `${prasannaDir}/Templates/${file}`);
      });
    }

    Object.values(SUBJECT_ALIASES).forEach(subFolder => {
      const subPath = path.join(fullPrasannaPath, subFolder);
      if (fs.existsSync(subPath) && fs.statSync(subPath).isDirectory()) {
        const notes: string[] = [];
        const scanNotes = (dir: string) => {
          fs.readdirSync(dir).forEach(file => {
            const p = path.join(dir, file);
            if (fs.statSync(p).isDirectory()) scanNotes(p);
            else if (file.endsWith('.md')) notes.push(path.relative(REPO_ROOT, p).replace(/\\/g, '/'));
          });
        };
        scanNotes(subPath);
        index.notes.bySubject.set(toKebab(subFolder), notes);
      }
    });
  }

  // Populate allMarkdownFiles for search tool
  index.allMarkdownFiles = [
    ...Array.from(index.skills.values()),
    ...Array.from(index.agents.values()),
    ...Array.from(index.commands.values()),
    ...Array.from(index.rules.values()),
    ...Array.from(index.notes.hubs.values()),
    ...Array.from(index.notes.dashboards.values()),
    ...Array.from(index.notes.templates.values()),
    ...Array.from(index.notes.bySubject.values()).flat()
  ];

  return index;
}

export function resolveSubject(input: string): string | null {
  const norm = input.toLowerCase().trim();
  return SUBJECT_ALIASES[norm] ?? null;
}
