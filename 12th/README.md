# 📙 Grade 12 Senior Boards Ecosystem (ECB-12)

<div align="center">

<img src="../assets/cbse_claw_mascot.png" alt="Claw — Grade 12 Senior Edition" width="200" />

**The high-density intelligence layer for PCMB/PCMC Grade 12 Board Exams.**

[![CBSE Grade 12](https://img.shields.io/badge/CBSE-Grade_12_Senior-orange?style=for-the-badge&logo=google-classroom&logoColor=white)](https://cbse.gov.in)
[![Stream: PCMB/PCMC](https://img.shields.io/badge/Stream-PCMB_/_PCMC-007ACC?style=for-the-badge&logo=python&logoColor=white)](#the-senior-advantage)
[![Target: 490+](https://img.shields.io/badge/Target-490%2B_/_500-1DB954?style=for-the-badge&logo=target&logoColor=white)](#the-senior-advantage)
[![Vault: Prasanna-12](https://img.shields.io/badge/Vault-Prasanna--12-blueviolet?style=for-the-badge&logo=obsidian&logoColor=white)](#the-knowledge-vault)

<br />

<img src="../assets/everything_cbse_board_hero.png" alt="ECB 12th — Senior Board Exam Command Center" width="600" />

<br />

*35+ Specialized Skills · 8 Senior Agents · 22 Workflow Commands · Full Obsidian Graph Integration*

</div>

---

<a name="the-senior-advantage"></a>
## 💎 The Senior Advantage (PCMB/PCMC)

Grade 12 isn't just about knowledge—it's about **derivation mastery, numerical precision, and entrance-aligned board prep**. ECB-12 is specifically tuned for the Senior Board Exam DNA, bridging the gap between raw NCERT and the rigorous demands of CBSE evaluation.

### Why ECB-12?

| The Senior Challenge | ECB-12 Solution |
| :--- | :--- |
| **Derivation Fatigue** | `/derivation-drill` — Random derivation generator with step-by-step logic checking. |
| **Numerical Accuracy** | **Math-Step-Evaluator** — Grades partial steps in Calculus and 3D Geometry. |
| **Practical & Viva Prep** | **Practical-Examiner Agent** — Simulates Viva Voce for Salt Analysis and Physics experiments. |
| **Board + JEE/NEET Balance** | **JEE/NEET Drill Agents** — Toggles between board-style theory and entrance-style MCQs. |

<div align="center">
  <img src="../assets/claw_science_lab.png" alt="Claw in the Science Lab" width="240" />
  <br />
  <sub><b>Senior Board Lab</b> — From Organic mechanisms to Electromagnetic Induction.</sub>
</div>

---

## 🏗️ Repository Architecture

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
│   ├── common/                          ← General skills
│   │   ├── english-core/SKILL.md        ← Literature & Writing Skills
│   │   ├── cbq-engine/SKILL.md          ← Case Based Questions generator
│   │   ├── derivation-bank/SKILL.md     ← Master repository of derivations
│   │   ├── practical-guide/SKILL.md     ← 30-mark practical exams & viva
│   │   ├── ncert-mirror/SKILL.md        ← NCERT strict terminology
│   │   ├── keyword-bank/SKILL.md        ← Subject-wise examiner keywords
│   │   ├── formula-bank/SKILL.md        ← Master formula repository
│   │   ├── ia-optimizer/SKILL.md        ← 20 marks Internal Assessment optimizer
│   │   ├── exam-strategy/SKILL.md       ← 490+ Master Strategy
│   │   ├── answer-writing/SKILL.md      ← Structure for 1, 2, 3, 5 mark answers
│   │   ├── time-manager/SKILL.md        ← Pacing guide (Total 180 mins)
│   │   ├── revision-planner/SKILL.md    ← Multi-pass revision framework
│   │   ├── spaced-repetition/SKILL.md   ← Review intervals
│   │   ├── mistake-dna/SKILL.md         ← Error categorization
│   │   ├── weak-chapter-tracker/SKILL.md← Tracking sub-topics below 70%
│   │   ├── mental-balance/SKILL.md      ← Burnout prevention & stress management
│   │   └── topper-patterns/SKILL.md     ← Answer templates from toppers
│
├── agents/                              ← 8 agents
│   ├── tutor.md                         ← Socratic subject tutor
│   ├── examiner.md                      ← CBSE-style question generator
│   ├── evaluator.md                     ← Answer marker per CBSE scheme
│   ├── practical-examiner.md            ← Viva prep and practical check
│   ├── neet-drill.md                    ← NEET MCQ pattern generator
│   ├── jee-drill.md                     ← JEE Mains/Advanced pattern generator
│   ├── planner.md                       ← Revision schedule builder
│   └── weak-spotter.md                  ← Weak chapter identifier
│
├── commands/                            ← 22 commands
│   ├── practice.md                      ← /practice
│   ├── explain.md                       ← /explain
│   ├── mock-test.md                     ← /mock-test
│   ├── mark-my-answer.md                ← /mark-my-answer
│   ├── revision-plan.md                 ← /revision-plan
│   ├── chapter-summary.md               ← /chapter-summary
│   ├── derivation-drill.md              ← /derivation-drill
│   ├── practical-check.md               ← /practical-check
│   ├── neet-mcq.md                      ← /neet-mcq
│   ├── jee-mcq.md                       ← /jee-mcq
│   ├── cbq-practice.md                  ← /cbq-practice
│   ├── cbq-walkthrough.md               ← /cbq-walkthrough
│   ├── warm-up.md                       ← /warm-up
│   ├── pre-board.md                     ← /pre-board
│   ├── exam-hall.md                     ← /exam-hall
│   ├── generate-report.md               ← /generate-report
│   ├── ncertify.md                      ← /ncertify
│   ├── keyword-pass.md                  ← /keyword-pass
│   ├── paper-pacing.md                  ← /paper-pacing
│   ├── ia-plan.md                       ← /ia-plan
│   ├── check-in.md                      ← /check-in
│   └── graph-path.md                    ← /graph-path
│
├── claude-ai-upload/                    ← Unified payload
│   ├── skill-commands-and-rules.md      ← 🔴 ALL agents + commands + rules in ONE file
│   ├── vault-knowledge-base.md          ← 🔵 ALL Prasanna-12 vault notes in ONE file
│   └── skill-*.md                       ← Copied and flattened skill files
│
├── mcp-server/                         ← Claude Desktop bridge
│   ├── src/                             ← TypeScript logic
│   └── package.json                     ← Dependencies
│
├── generate_upload.py                   ← Skill/Agent/Command bundler
├── generate_vault_knowledge.py          ← Obsidian vault bundler
├── sync_upload_folder.py                ← 🟢 Master Orchestrator (Run this)
│
└── Prasanna-12/                         ← Personal Knowledge Base (Obsidian Wiki)
    ├── Physics/                         ← Chapters & Notes
    ├── Chemistry/                       ← Chapters & Notes
    ├── Mathematics/                     ← Chapters & Notes
    ├── Biology/                         ← Chapters & Notes
    ├── Computer-Science/                ← Chapters & Notes
    ├── English/                         ← Literature & Grammar
    ├── Templates/                       ← Note templates
    ├── All Diagrams.md                  ← Master Diagram Hub
    ├── All Formulas.md                  ← Master Formula Hub
    ├── All Derivations.md               ← Master Derivations List
    ├── Keywords Bank.md                 ← Master Keyword Hub
    ├── Strategy Hub.md                  ← Strategy Dashboard
    ├── Topper Answer Patterns.md        ← Best Practices Hub
    └── Home.md                          ← Main Dashboard
```

---

<a name="the-knowledge-vault"></a>
## 📂 The Knowledge Vault (Prasanna-12)

The `Prasanna-12/` directory is an Obsidian-compatible knowledge graph. It’s not a collection of PDFs—it’s a living, backlinked study system.

- **Atomic Knowledge Notes**: 100+ files covering every chapter of Physics, Chemistry, Math, and Bio/CS.
- **Master Hubs**:
  - `All Derivations.md`: Every board-relevant derivation indexed by weightage.
  - `All Formulas.md`: Subject-wise formula banks with application notes.
  - `Topper Answer Patterns.md`: Visual guides on how to structure a 5-mark answer.
- **Automated Sync**: The `sync_upload_folder.py` script flattens this vault into a single context-rich file for Claude, enabling "Search-over-Vault" capabilities.

<div align="center">
  <img src="../assets/claw_revision.png" alt="Claw's Revision System" width="220" />
  <br />
  <sub><b>Graph-Based Revision</b> — Every concept linked to its prerequisites.</sub>
</div>

---

## 🤖 Senior Agent Roster

| Agent | Purpose |
| :--- | :--- |
| **Socratic Tutor** | Guides through complex concepts like Calculus or Genetics without giving the answer. |
| **Practical Examiner** | Simulates the 30-mark practical exam environment (Viva/Observation/Procedure). |
| **JEE/NEET Drills** | Switches focus to competitive MCQ patterns with negative marking simulation. |
| **Math Evaluator** | Specifically trained on CBSE partial-marking schemes for long-form calculations. |

---

## ⌨️ Workflow Commands

- `/practice subject:physics topic:optics` — Loads 12th Physics skill + Optics derivations.
- `/derivation-drill` — Picks a derivation, asks for key steps, and evaluates logic.
- `/practical-check` — Starts a simulated Viva session for the chosen subject.
- `/neet-mcq` / `/jee-mcq` — Toggles competitive mode for the current topic.

---

<div align="center">

<img src="../assets/claw_high_scorer.png" alt="Claw celebrating" width="160" />

<br />

**"Precision is the difference between a pass and a lead."**

<br />

[![Back to Root](https://img.shields.io/badge/🏠_Back_to_Root-ECB_Home-2D3A6E?style=for-the-badge)](../README.md)
[![Chinese Version](https://img.shields.io/badge/📖_中文文档-README_zh-red?style=for-the-badge)](../README_zh.md)

</div>

