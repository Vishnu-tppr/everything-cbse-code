/**
 * Startup content index builder.
 * Scans the cbse-tools repo on boot and builds an in-memory map
 * of all skills, agents, commands, rules, and Prasanna notes.
 */
import * as path from 'node:path';
import { safeListDir, safeExists, safeIsDir } from './fs.js';

export interface CBSEIndex {
  skills: Map<string, string>;          // "mathematics" → "skills/mathematics/SKILL.md"
  agents: Map<string, string>;          // "tutor" → "agents/tutor.md"
  commands: Map<string, string>;        // "practice" → "commands/practice.md"
  rules: Map<string, string>;          // "accuracy" → "rules/accuracy.md"
  notes: {
    bySubject: Map<string, string[]>;  // "math" → ["Prasanna/Math/Ch01 - Real Numbers.md", ...]
    hubs: Map<string, string>;         // "all-formulas" → "Prasanna/All Formulas.md"
    dashboards: Map<string, string>;   // "home" → "Prasanna/Home.md"
    templates: Map<string, string>;    // "chapter-note" → "Prasanna/Templates/Chapter Note.md"
  };
  allMarkdownFiles: string[];          // every .md outside .obsidian/
}

/** Normalise a display name to lowercase-kebab for map keys */
function toKebab(name: string): string {
  return name
    .replace(/\.md$/i, '')
    // Strip emoji and other non-ASCII symbols (keep letters, numbers, spaces, hyphens)
    .replace(/[^\p{L}\p{N}\s\-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase();
}

/** Subject folder name aliases → Prasanna subfolder */
const SUBJECT_ALIASES: Record<string, string> = {
  'math': 'Math',
  'maths': 'Math',
  'mathematics': 'Math',
  'science': 'Science',
  'physics': 'Science',
  'chemistry': 'Science',
  'biology': 'Science',
  'sst': 'SST',
  'social-science': 'SST',
  'social': 'SST',
  'history': 'SST',
  'geography': 'SST',
  'civics': 'SST',
  'economics': 'SST',
  'political-science': 'SST',
  'english': 'English',
  'tamil': 'Tamil',
};

/** Known hub files at Prasanna/ root (not subject dashboards) */
const HUB_FILES = [
  'All Diagrams.md',
  'All Formulas.md',
  'Keywords Bank.md',
  'Topper Answer Patterns.md',
];

/** Known dashboard files at Prasanna/ root (subject dashboards) — with emoji prefixes */
const DASHBOARD_FILES = [
  '🏠 Home.md',
  '📖 English.md',
  '📘 Mathematics.md',
  '🔬 Science.md',
  '🌍 Social Science.md',
  '📝 Tamil.md',
  '🎯 Strategy Hub.md',
];

/** Recursively find all SKILL.md files under skills/ */
function indexSkills(index: CBSEIndex): void {
  const skillsDir = 'skills';
  if (!safeExists(skillsDir)) return;

  function scanDir(relDir: string): void {
    const entries = safeListDir(relDir);
    for (const entry of entries) {
      const entryPath = path.posix.join(relDir, entry);
      if (safeIsDir(entryPath)) {
        // Check if this dir has a SKILL.md
        const skillFile = path.posix.join(entryPath, 'SKILL.md');
        if (safeExists(skillFile)) {
          const key = toKebab(entry);
          index.skills.set(key, skillFile);
          index.allMarkdownFiles.push(skillFile);
        }
        // Also recurse into subdirs (science/physics, social-science/history)
        scanDir(entryPath);
      }
    }
  }

  scanDir(skillsDir);
}

/** Index agents/*.md */
function indexAgents(index: CBSEIndex): void {
  const agentsDir = 'agents';
  if (!safeExists(agentsDir)) return;

  const entries = safeListDir(agentsDir);
  for (const entry of entries) {
    if (entry.endsWith('.md')) {
      const key = toKebab(entry);
      const relPath = path.posix.join(agentsDir, entry);
      index.agents.set(key, relPath);
      index.allMarkdownFiles.push(relPath);
    }
  }
}

/** Index commands/*.md */
function indexCommands(index: CBSEIndex): void {
  const commandsDir = 'commands';
  if (!safeExists(commandsDir)) return;

  const entries = safeListDir(commandsDir);
  for (const entry of entries) {
    if (entry.endsWith('.md')) {
      const key = toKebab(entry);
      const relPath = path.posix.join(commandsDir, entry);
      index.commands.set(key, relPath);
      index.allMarkdownFiles.push(relPath);
    }
  }
}

/** Index rules/*.md */
function indexRules(index: CBSEIndex): void {
  const rulesDir = 'rules';
  if (!safeExists(rulesDir)) return;

  const entries = safeListDir(rulesDir);
  for (const entry of entries) {
    if (entry.endsWith('.md')) {
      const key = toKebab(entry);
      const relPath = path.posix.join(rulesDir, entry);
      index.rules.set(key, relPath);
      index.allMarkdownFiles.push(relPath);
    }
  }
}

/** Index Prasanna/ notes, hubs, dashboards, and templates */
function indexNotes(index: CBSEIndex): void {
  const prasannaDir = 'Prasanna';
  if (!safeExists(prasannaDir)) return;

  // Hub files
  for (const hubFile of HUB_FILES) {
    const relPath = path.posix.join(prasannaDir, hubFile);
    if (safeExists(relPath)) {
      index.notes.hubs.set(toKebab(hubFile), relPath);
      index.allMarkdownFiles.push(relPath);
    }
  }

  // Dashboard files
  for (const dashFile of DASHBOARD_FILES) {
    const relPath = path.posix.join(prasannaDir, dashFile);
    if (safeExists(relPath)) {
      index.notes.dashboards.set(toKebab(dashFile), relPath);
      index.allMarkdownFiles.push(relPath);
    }
  }

  // Templates
  const templatesDir = path.posix.join(prasannaDir, 'Templates');
  if (safeExists(templatesDir)) {
    const entries = safeListDir(templatesDir);
    for (const entry of entries) {
      if (entry.endsWith('.md')) {
        const relPath = path.posix.join(templatesDir, entry);
        index.notes.templates.set(toKebab(entry), relPath);
        index.allMarkdownFiles.push(relPath);
      }
    }
  }

  // Subject notes (English, Math, Science, SST, Tamil)
  const subjectFolders = ['English', 'Math', 'Science', 'SST', 'Tamil'];
  for (const folder of subjectFolders) {
    const folderPath = path.posix.join(prasannaDir, folder);
    if (!safeExists(folderPath) || !safeIsDir(folderPath)) continue;

    const key = toKebab(folder);
    const notes: string[] = [];

    function scanNotes(dir: string): void {
      const entries = safeListDir(dir);
      for (const entry of entries) {
        const entryPath = path.posix.join(dir, entry);
        if (safeIsDir(entryPath)) {
          scanNotes(entryPath);
        } else if (entry.endsWith('.md')) {
          notes.push(entryPath);
          index.allMarkdownFiles.push(entryPath);
        }
      }
    }

    scanNotes(folderPath);
    index.notes.bySubject.set(key, notes);
  }
}

/** Also index top-level .md files (CBSE.md, AGENTS.md, etc.) */
function indexTopLevel(index: CBSEIndex): void {
  const topFiles = safeListDir('.');
  for (const entry of topFiles) {
    if (entry.endsWith('.md') && !safeIsDir(entry)) {
      index.allMarkdownFiles.push(entry);
    }
  }
}

/**
 * Build the complete CBSE index. Call once on startup.
 * Logs counts to stderr.
 */
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

  indexSkills(index);
  indexAgents(index);
  indexCommands(index);
  indexRules(index);
  indexNotes(index);
  indexTopLevel(index);

  // Count total notes
  let noteCount = 0;
  for (const files of index.notes.bySubject.values()) {
    noteCount += files.length;
  }
  noteCount += index.notes.hubs.size + index.notes.dashboards.size + index.notes.templates.size;

  process.stderr.write(
    `[cbse-tools-mcp] Index built: ` +
    `${index.skills.size} skills | ` +
    `${index.agents.size} agents | ` +
    `${index.commands.size} commands | ` +
    `${index.rules.size} rules | ` +
    `${noteCount} notes | ` +
    `${index.allMarkdownFiles.length} total .md files\n`
  );

  return index;
}

/** Resolve subject input to a Prasanna subfolder name */
export function resolveSubject(input: string): string | null {
  const normalised = input.toLowerCase().trim();
  return SUBJECT_ALIASES[normalised] ?? null;
}

/** Export aliases for use in tools that need fuzzy subject matching */
export { SUBJECT_ALIASES };
