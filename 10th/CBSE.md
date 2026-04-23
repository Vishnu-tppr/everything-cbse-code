---
name: cbse
description: >-
  CBSE Tools - Board Exam Preparation System
---

# CBSE Tools — Board Exam Preparation System

CBSE Tools is a structured, ECB-style (Everything Claude Code) skill/agent/command ecosystem designed for CBSE Grade 10 Board Exam preparation. It provides AI-powered tutoring, question generation, answer evaluation, revision planning, and exam strategy — all aligned with the official CBSE 2026–27 syllabus. The target: **495+ out of 500**.

## Autonomous Operation

This system operates autonomously — just like ECB. You don't need to manually invoke agents or load skills. The system:

1. **Auto-detects the subject** from your question (keywords, chapter names, concepts)
2. **Auto-loads the right skill** (formulas, facts, marking schemes from SKILL.md files)
3. **Auto-selects the right agent** (tutor for explaining, examiner for questions, evaluator for marking)
4. **Auto-chains agents** (evaluator → weak-spotter if score < 60%, weak-spotter → planner if 3+ chapters weak)

See `AGENTS.md` for full orchestration rules. See `rules/` for always-active guidelines.

## How to Use with Claude

Start any session with a command:
```
/practice math triangles hard 5
/explain science "electromagnetic induction"
/mock-test english 3hr
/mark-my-answer science "What is Ohm's Law?" "Ohm's law states that..."
/revision-plan 2027-03-01 "trigonometry,heredity,nationalism-in-india"
/chapter-summary math "quadratic equations"
```

Or just ask naturally — the system auto-detects:
```
"Explain photosynthesis"                → tutor + biology skill
"Give me 5 hard questions on algebra"   → examiner + math skill
"Check my answer on Salt March"         → evaluator + history skill
"I got 45% in electricity chapter test" → weak-spotter + physics skill
"Help me make a study plan for March"   → planner + exam-strategy skill
```

## Subject Index

| Subject | Chapters | Theory Marks | IA Marks | Key Focus Areas |
|---------|----------|-------------|----------|-----------------|
| **Mathematics (Standard)** | 14 chapters | 80 | 20 | Algebra (20M), Geometry (15M), Trigonometry (12M) |
| **Science** | 13 chapters | 80 | 20 | Chemistry (25M), Biology (30M), Physics (25M) |
| **Social Science** | 22 chapters | 80 | 20 | Equal 20M per discipline — History, Geo, PolSci, Eco |
| **English Lang & Lit** | 28 pieces | 80 | 20 | Literature (40M), Reading (20M), Writing+Grammar (20M) |
| **Tamil** | 6 Iyals + Grammar | 80 | 20 | Literature (41M), Grammar (12M), Reading (10M), Writing (17M) |

## Command Quick Reference

### Core Study Commands
| Command | What It Does |
|---------|-------------|
| `/practice [subj] [ch] [diff] [n]` | Generate N practice questions |
| `/explain [subj] [concept]` | Socratic concept explanation |
| `/mock-test [subj] [duration]` | Full CBSE-style test paper |
| `/mark-my-answer [subj] [q] [ans]` | Evaluate answer per CBSE scheme |
| `/revision-plan [date] [weak-chapters]` | Day-by-day study calendar |
| `/chapter-summary [subj] [chapter]` | Exam-ready chapter summary |

### CBQ & Exam Format Commands
| Command | What It Does |
|---------|-------------|
| `/cbq-practice [subj] [ch] [n]` | Case study + AR question practice |
| `/cbq-walkthrough [subj] [ch]` | Step-by-step CBQ thinking process |
| `/warm-up [subj]` | Daily 20-min mixed practice (7 questions) |
| `/map-drill [category] [n]` | Geography map work quiz (5 free marks) |
| `/pre-board [subj] [school-type]` | KV/Navodaya difficulty stress test |
| `/exam-hall [subj]` | Strict simulation — no hints, no retries |

### Optimization & Tracking Commands
| Command | What It Does |
|---------|-------------|
| `/ncertify [subj] [answer]` | Check NCERT language compliance |
| `/keyword-pass [subj] [q] [ans]` | Keyword coverage check |
| `/paper-pacing [subj]` | Time budget per section |
| `/ia-plan [subj]` | Internal assessment 20/20 planner |
| `/graph-path [subj] [ch]` | Prerequisite chain + foundation fix |
| `/check-in` | Daily wellness check (burnout prevention) |
| `/generate-report [period]` | Weekly/monthly progress for mentor |

## Score Strategy: How to Get 495+/500

### The 495+ Blueprint (5 marks = maximum loss allowed)

**Mathematics (Target: 100/100)**
- Master Algebra (20M) — this is the highest-weightage unit
- Practice 50+ Case Study questions — these are the trickiest
- Never skip steps in solutions — show every line for full marks
- Memorize all formulas for Mensuration and Trigonometry
- Do 20+ full papers timed at 3 hours

**Science (Target: 99-100/100)**
- Chemistry: Write balanced equations with states (s, l, g, aq) — 1 mark lost here is common
- Physics: Always draw circuit diagrams and ray diagrams — marks are in the diagrams
- Biology: Learn diagrams (heart, nephron, neuron, reproductive system) with labels
- Use keyword-based answers — examiners check for specific terms

**Social Science (Target: 99-100/100)**
- History: Learn exact dates, names, and movements — no approximation
- Geography: Map work is free marks (5M) — practice India map daily
- Political Science: Use constitutional terminology in answers
- Economics: Learn all HDI, GDP, per capita income data with year references

**English (Target: 98-100/100)**
- Literature: Quote from the text in answers — examiners love textual evidence
- Writing: Follow the exact format (letter format, paragraph structure)
- Grammar: Practice 100+ tense, reported speech, and determiner exercises
- Reading comprehension: Answer in complete sentences, never in fragments

**Tamil (Target: 98-100/100)**
- Memorize all Ceyyul (poetry) with author names and context
- Master Ilakkanam (grammar) — Eluthu, Chol, Thogainilai
- Practice letter writing formats (official + informal)
- Study from Koonar Tamil Urai textbook thoroughly

### Internal Assessment (IA) Strategy: 20/20 in Every Subject
- Maintain neat, complete notebooks throughout the year
- Score consistently in periodic tests (3 tests matter)
- Complete projects on time with proper formatting
- Participate in subject enrichment activities

### Recommended Books & Resources
| Subject | Primary | Supplementary | Practice |
|---------|---------|---------------|----------|
| Mathematics | NCERT | RD Sharma | Oswaal Sample Papers, KV Papers |
| Science | NCERT | Oswaal | Navodaya Papers, CBSE Sample Papers |
| Social Science | NCERT | Oswaal | KV Papers, Toppers' Answer Sheets |
| English | First Flight + Footprints | Oswaal | CBSE Sample Papers, Grammar Workbooks |
| Tamil | Koonar Tamil Urai | SCERT TN Textbook | Previous Year Papers |

## Architecture (v3.0 — 64 files, ~280 KB)

```
cbse-tools/
├── CBSE.md                              ← You are here (master index)
├── AGENTS.md                            ← Autonomous orchestration brain
│
├── rules/                               ← Always-active (7 files)
│   ├── accuracy.md                      ← NCERT fact-checking
│   ├── teaching-style.md                ← Socratic method + encouragement
│   ├── answer-format.md                 ← CBSE answer structure
│   ├── word-budget.md                   ← Answer-length calibration
│   ├── subject-detection.md             ← Auto-load correct skill
│   └── agent-chaining.md               ← Agent-to-agent auto-triggers
│
├── skills/                              ← 28 skill files
│   ├── mathematics/SKILL.md             ← Full Math syllabus + formulas
│   ├── science/
│   │   ├── physics/SKILL.md             ← Light, Electricity, Magnetism
│   │   ├── chemistry/SKILL.md           ← Reactions, Acids, Carbon, Metals
│   │   └── biology/SKILL.md             ← Life Processes, Heredity, Environment
│   ├── social-science/
│   │   ├── history/SKILL.md             ← Nationalism, Movements, Print Culture
│   │   ├── geography/SKILL.md           ← Resources, Agriculture, Industry
│   │   ├── political-science/SKILL.md   ← Power Sharing, Federalism, Parties
│   │   └── economics/SKILL.md           ← Development, Sectors, Globalisation
│   ├── english/SKILL.md                 ← First Flight + Footprints + Grammar
│   ├── tamil/SKILL.md                   ← Iyal 1-6 + Ilakkanam + Writing
│   │
│   ├── cbq-engine/SKILL.md              ← 🔴 50% of paper — CBQ format mastery
│   ├── assertion-reason/SKILL.md        ← 🔴 AR decision matrix trainer
│   ├── geography-maps/SKILL.md          ← 🟢 5 free marks — 50+ locations
│   ├── topper-patterns/SKILL.md         ← Answer templates from toppers
│   ├── mistake-dna/SKILL.md             ← WHY mistakes happen (C/R/P/X/A)
│   ├── ncert-mirror/SKILL.md            ← NCERT language compliance checker
│   ├── keyword-bank/SKILL.md            ← Chapter-specific examiner keywords
│   ├── ia-optimizer/SKILL.md            ← Silent 100 marks (20/subj × 5)
│   ├── time-manager/SKILL.md            ← Per-section pacing blueprints
│   ├── exam-hall-mode/SKILL.md          ← Strict simulation rules
│   ├── mental-balance/SKILL.md          ← Burnout prevention
│   ├── concept-graph/SKILL.md           ← Prerequisite dependency chains
│   ├── spaced-repetition/SKILL.md       ← Review intervals (1/3/7/14/30 days)
│   ├── exam-strategy/SKILL.md           ← 495+ master strategy
│   ├── answer-writing/SKILL.md          ← Board exam answer craft
│   ├── question-bank/SKILL.md           ← Personal question bank builder
│   ├── revision-planner/SKILL.md        ← Multi-pass revision framework
│   └── weak-chapter-tracker/SKILL.md    ← Mastery tracking
│
├── agents/                              ← 7 agents
│   ├── tutor.md                         ← Socratic subject tutor
│   ├── examiner.md                      ← CBSE-style question generator
│   ├── evaluator.md                     ← Answer marker per CBSE scheme
│   ├── math-step-evaluator.md           ← Math partial-credit step marking
│   ├── case-builder.md                  ← CBQ scenario generator
│   ├── planner.md                       ← Revision schedule builder
│   └── weak-spotter.md                  ← Weak chapter identifier
│
└── commands/                            ← 19 commands
    ├── commands.md                       ← Master command registry
    ├── practice.md                       ← /practice
    ├── explain.md                        ← /explain
    ├── mock-test.md                      ← /mock-test
    ├── mark-my-answer.md                ← /mark-my-answer
    ├── revision-plan.md                 ← /revision-plan
    ├── chapter-summary.md               ← /chapter-summary
    ├── cbq-practice.md                  ← /cbq-practice
    ├── cbq-walkthrough.md               ← /cbq-walkthrough (thinking process)
    ├── warm-up.md                       ← /warm-up (daily 20-min habit)
    ├── map-drill.md                     ← /map-drill (geography)
    ├── pre-board.md                     ← /pre-board (KV/Navodaya difficulty)
    ├── exam-hall.md                     ← /exam-hall (strict simulation)
    ├── generate-report.md               ← /generate-report (mentor view)
    ├── ncertify.md                      ← /ncertify (NCERT language check)
    ├── keyword-pass.md                  ← /keyword-pass (keyword coverage)
    ├── paper-pacing.md                  ← /paper-pacing (time budget)
    ├── ia-plan.md                       ← /ia-plan (IA 20/20 optimizer)
    ├── check-in.md                      ← /check-in (burnout prevention)
    └── graph-path.md                    ← /graph-path (prerequisites)
```

## Autonomous Agent Flow

```
Student Input
     │
     ▼
┌─────────────────────────┐
│ SUBJECT DETECTION       │  ← rules/subject-detection.md
│ (auto-loads skill)      │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ AGENT SELECTION         │  ← AGENTS.md orchestration
│ (auto-picks best agent) │
└────────┬────────────────┘
         │
    ┌────┼────┬────┬────┐
    ▼    ▼    ▼    ▼    ▼
 TUTOR EXAM EVAL PLAN WEAK
    │    │    │    │    │
    └────┼────┼────┼────┘
         │    │    │
         ▼    ▼    ▼
   AUTO-CHAINING (rules/agent-chaining.md)
   eval<60% → weak-spotter → planner
   explain → concept-check question
   practice → auto-mark after attempt
```

## Upgrade Path

### → CBSE Grade 11 (JEE Foundation Track)
- Replace Social Science with Physics / Chemistry / Mathematics / Biology skill files
- Add `/jee-concept` and `/jee-problem` commands
- Add `jee-tutor` agent (problem-solving focused, not board-writing focused)
- Retain exam-strategy, answer-writing, revision-planner skills
- Integrate HC Verma (Physics), MS Chouhan (Chemistry), Cengage (Mathematics)

### → CBSE Grade 12 + JEE Mains/Advanced
- Expand Mathematics to full JEE syllabus (Calculus, Vectors, 3D, Probability)
- Add Chemistry Organic/Inorganic/Physical deep-skill files
- Add `/jee-mock`, `/jee-analyze-mistakes` commands
- Add JEE PYQ (previous year question) agent
- Integrate coaching material patterns (Allen, FIITJEE, Resonance)

### → NEET Track (Alternative to JEE)
- Replace Mathematics with Biology deep-skills
- Add `/neet-practice`, `/neet-mock` commands
- Add NEET PYQ agent
- Integrate MTG, Trueman's Biology, OP Tandon Chemistry

