---
name: cbse12
description: >-
  CBSE 12th Tools - Grade 12 Board Exam Preparation System (495+/500)
---

# CBSE 12th Tools — Board Exam Preparation System

CBSE 12th Tools is a structured, ECB-style (Everything Claude Code) skill/agent/command ecosystem designed for CBSE Grade 12 Board Exam preparation (Batch 2026-27). It provides AI-powered tutoring, question generation, answer evaluation, and specialized support for both **PCMB** (Medical) and **PCMC** (Engineering) streams. The target: **495+ out of 500**.

## Autonomous Operation

This system operates autonomously — just like ECB. You don't need to manually invoke agents or load skills. The system:

1. **Auto-detects the subject** from your question (keywords, chapter names, concepts).
2. **Auto-loads the right skill** (formulas, derivations, marking schemes from SKILL.md files).
3. **Auto-selects the right agent** (tutor for explaining, examiner for questions, evaluator for marking).
4. **Auto-chains agents** (evaluator → weak-spotter if score < 70%, weak-spotter → planner if 3+ chapters weak).

See `AGENTS.md` for full orchestration rules. See `rules/` for always-active guidelines.

## How to Use with Claude

Start any session with a command:
```
/practice physics "Optics" hard 5
/explain chemistry "Nernst Equation"
/mock-test mathematics 3hr
/mark-my-answer biology "Explain the process of DNA replication." "DNA replication is..."
/revision-plan 2027-03-01 "Integration,Genetics,Organic-Chemistry"
/derivation-drill physics "Gauss's Law"
```

Or just ask naturally — the system auto-detects:
```
"Explain the Lens Maker's Formula"          → tutor + physics skill
"Give me 5 hard questions on Integration"   → examiner + math skill
"Check my answer on DNA fingerprinting"     → evaluator + biology skill
"I got 55% in the Electrostatics test"      → weak-spotter + physics skill
"Help me make a study plan for Boards"      → planner + exam-strategy skill
```

## Subject Index (PCMB/PCMC)

| Subject | Chapters | Theory Marks | Practical/IA | Key Focus Areas |
|---------|----------|-------------|--------------|-----------------|
| **Physics** | 14 chapters | 70 | 30 | Optics (18M), Electrostatics (16M), AC/EMI (17M) |
| **Chemistry** | 10 chapters | 70 | 30 | Organic (33M), Physical (23M), Inorganic (14M) |
| **Mathematics** | 13 chapters | 80 | 20 | Calculus (35M), Vectors/3D (14M), Algebra (10M) |
| **Biology** | 13 chapters | 70 | 30 | Genetics (20M), Reproduction (16M), Biotech (12M) |
| **Comp Science** | 13 chapters | 70 | 30 | Computational Thinking (40M), Networking (10M), SQL (20M) |
| **English Core** | Literature | 80 | 20 | Literature (40M), Writing (20M), Reading (20M) |

## Command Quick Reference

### Core Study Commands
| Command | What It Does |
|---------|-------------|
| `/practice [subj] [ch] [diff] [n]` | Generate N practice questions (Easy/Med/Hard) |
| `/explain [subj] [concept]` | Socratic concept explanation with concept check |
| `/mock-test [subj] [duration]` | Full CBSE-style test paper (70/80 marks) |
| `/mark-my-answer [subj] [q] [ans]` | Evaluate answer per 12th Board marking scheme |
| `/revision-plan [date] [weak-chapters]` | Day-by-day study calendar |
| `/chapter-summary [subj] [chapter]` | High-density mastery summary (Keywords + Formulas) |

### 12th Specific Commands
| Command | What It Does |
|---------|-------------|
| `/derivation-drill [subj] [topic]` | Targeted drill for mandatory board derivations |
| `/cbq-practice [subj] [ch] [n]` | Case study + Assertion-Reason mastery |
| `/cbq-walkthrough [subj] [ch]` | Step-by-step thinking process for 4M questions |
| `/neet-mcq [ch] [n]` | NEET pattern practice (PCMB students) |
| `/jee-mcq [ch] [n]` | JEE Mains pattern practice (PCMC students) |
| `/practical-check [subj]` | Viva-voce prep and practical experiment logic |

### Optimization & Tracking
| Command | What It Does |
|---------|-------------|
| `/ncertify [subj] [answer]` | Check for NCERT strict terminology compliance |
| `/keyword-pass [subj] [q] [ans]` | Examiner keyword coverage check |
| `/paper-pacing [subj]` | Time budget per section (Section A-E) |
| `/ia-plan [subj]` | 30/30 Practical/Internal Assessment optimizer |
| `/generate-report [period]` | Weekly/monthly progress for student/mentor |

## Score Strategy: How to Get 495+/500

### The 12th Grade Blueprint (Max loss allowed: 5 marks)

**Physics (Target: 100/100)**
- Master the **Derivation Bank**. Derivations account for ~15-20 marks.
- Optics is the giant (18 marks). Practice ray diagrams daily.
- Use `/practice physics [ch] hard` for LCR circuits and Gauss's Law applications.

**Chemistry (Target: 100/100)**
- Organic Chemistry (33M) is where most lose marks. Master the **Named Reactions** and **Mechanisms**.
- Physical Chemistry numericals (Nernst, Kinetics) must have units in the final answer.
- Inorganic: Memorize trends in d- and f- block using the `keyword-bank`.

**Mathematics (Target: 100/100)**
- Calculus is 35% of the paper. Master Properties of Definite Integrals and Differential Equations.
- Vectors and 3D Geometry (14M) are high-scoring; never skip the diagram.
- Use `/mock-test math 3hr` to practice pacing for the lengthy 5-mark questions.

**Biology (Target: 100/100)**
- Genetics and Evolution (20M) is the core. Understand the "why" behind every cross.
- Biotechnology (12M) requires precise NCERT terminology (pBR322, PCR, etc.).
- Diagrams in Bio are mandatory; use the `All Diagrams` hub in Prasanna-12.

**English Core (Target: 98-100/100)**
- Literature: Character sketches must include specific "Value Points" from the marking scheme.
- Writing Skills: Stick to the word limit and follow the exact format for Letters and Invitations.

---

## Architecture (v1.0 — 82 files)

```text
cbse-12th-tools/
├── CBSE12.md                            ← Master index (You are here)
├── AGENTS.md                            ← Autonomous orchestration brain
│
├── rules/                               ← Always-active (8 files)
│   ├── accuracy.md                      ← NCERT & standard reference fact-checking
│   ├── agent-chaining.md                ← Agent-to-agent auto-triggers
│   ├── answer-format.md                 ← CBSE 12th answer structure (step marking)
│   ├── derivation-first.md              ← Prioritize derivations/proofs
│   ├── session-hooks.md                 ← Context loading hooks
│   ├── subject-detection.md             ← Auto-load correct stream (PCMB/PCMC)
│   ├── teaching-style.md                ← Socratic method
│   └── word-budget.md                   ← Answer-length calibration
│
├── skills/                              ← PCMB and PCMC specialized skills
│   ├── shared/                          ← Common core subjects
│   │   ├── physics/SKILL.md             ← Derivations, Numericals, Optics, EM
│   │   ├── chemistry/SKILL.md           ← Organic Reactions, Physical, Inorganic
│   │   └── mathematics/SKILL.md         ← Calculus, Vectors, 3D Geometry
│   ├── pcmb/                            ← Medical/NEET stream focus
│   │   ├── biology/SKILL.md             ← Genetics, Reproduction, Biotechnology
│   │   └── neet-strategy/SKILL.md       ← Board + NEET balance
│   ├── pcmc/                            ← Engineering/JEE stream focus
│   │   ├── computer-science/SKILL.md    ← Python, SQL, Networking
│   │   └── jee-strategy/SKILL.md        ← Board + JEE balance
│   └── common/                          ← General skills (cbq-engine, topper-patterns, etc.)
│
├── agents/                              ← 8 agents (tutor, examiner, evaluator, etc.)
├── commands/                            ← 22 commands (/practice, /explain, etc.)
├── mcp-server/                         ← Claude Desktop bridge
└── Prasanna-12/                         ← Obsidian Personal Knowledge Base
```

---

## Success Metrics

- Consistently score **>90%** in mixed mock tests.
- **Zero unit errors** in Physics and Physical Chemistry numericals.
- **100% keyword coverage** in Organic mechanisms and Biology descriptions.
- Completion of all **Mandatory Derivations** with 0 memory leaks.
- **Final Target:** **495+ out of 500** in CBSE 2027 Board Exam.

