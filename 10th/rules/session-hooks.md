---
name: session-hooks
description: >-
  Session Hooks - ECB-Style Lifecycle Automation
---

# Session Hooks — ECB-Style Lifecycle Automation

## What ECB Does (and CBSE Tools Must Mirror)

ECB has event-driven hooks that fire automatically at lifecycle boundaries.
CBSE Tools must do the same — NO manual invocation needed.

```
ECB Pattern:
  SessionStart → Load context, detect environment
  PostToolUse  → Auto-format, type-check, quality gate
  Stop         → Save state, evaluate patterns, track cost
  SessionEnd   → Cleanup, persist

CBSE Tools Pattern:
  SessionStart → Load student profile, show today's plan, run /check-in
  PostEvaluation → Classify mistake DNA, update weak tracker, suggest book work
  PostExplanation → Auto-generate concept check Q, suggest book exercises
  SessionEnd → Generate session summary, schedule spaced repetition reviews
```

---

## SESSION START (fires every time student opens a session)

```
AUTO-RUN ON SESSION START:
  
  1. GREET with context:
     "Welcome back! Last session you worked on [chapter].
      Your current mastery: [subject] = [X]%."
  
  2. CHECK SPACED REPETITION QUEUE:
     "You have 3 chapters due for review today:
      - Chemistry: Acids Bases (Day 7 review)
      - Math: AP (Day 14 review)  
      - History: Nationalism (Day 30 review)
      Quick recall test? Or skip to today's plan?"
  
  3. SHOW TODAY'S PLAN (if /revision-plan is active):
     "Today's plan: Chapter 8 — Trigonometry (3 hours)
      → NCERT Ex 8.1-8.2 (1h)
      → RD Sharma Level 1 (45min)
      → 5 practice questions (45min)
      → /warm-up at the end (20min)"
  
  4. OFFER /check-in (non-intrusive):
     "Quick check: How are you feeling today? (1=tired, 5=energized)
      [If student responds low → auto-adjust to lighter session]"
  
  5. LOAD PREVIOUS WEAK AREAS:
     Automatically load the weak-chapter-tracker state so
     all agents know what to prioritize.
```

## POST-EVALUATION (fires after EVERY answer is marked)

```
AUTO-RUN AFTER EVALUATION:

  1. CLASSIFY MISTAKE DNA:
     Every wrong answer → immediately categorize as:
     C (Conceptual) / R (Recall) / P (Presentation) / X (Careless) / A (Application)
     → Log to mistake-dna tracker
  
  2. UPDATE WEAK TRACKER:
     Recalculate chapter mastery percentage after every evaluation.
     If mastery drops below 80% → flag chapter as needing attention.
  
  3. SUGGEST BOOK WORK (auto-loaded from book-navigator):
     "📚 For more practice on this type of question:
      → RD Sharma Ch 4, Level 1, Q7-12 (similar difficulty)
      → Oswaal PYQ 2023, Q28 (same topic, board format)"
  
  4. TRIGGER CHAINS:
     Score < 60% → auto-invoke weak-spotter
     Score < 40% → auto-invoke concept-graph (prerequisite check)
     Math answer → auto-delegate to math-step-evaluator
  
  5. NCERT KEYWORD CHECK:
     Every answer → quick check against ncert-mirror
     If missing keywords → "You got the concept right! But remember
     to use the term 'peristaltic movement' — examiners look for it."
```

## POST-EXPLANATION (fires after tutor explains a concept)

```
AUTO-RUN AFTER EXPLANATION:

  1. GENERATE CONCEPT CHECK:
     Automatically generate 1 quick question to verify understanding.
     "Let's see if you got it. Quick question: [concept check Q]"
  
  2. GENERATE CBQ SCENARIO:
     Auto-invoke case-builder for 1 application question.
     "Now apply this to a real scenario: [CBQ case study]"
  
  3. RECOMMEND BOOK WORK:
     "📚 To reinforce this concept:
      → NCERT: Re-read Section [X], Page [Y]
      → [Book]: Exercise [Z], Questions [N-M]
      → Practice: Try 5 similar problems before moving on"
  
  4. SCHEDULE SPACED REPETITION:
     "I've added [concept] to your review queue.
      Review dates: Tomorrow, Day 3, Day 7, Day 14, Day 30."
```

## SESSION END (fires when student finishes studying)

```
AUTO-RUN ON SESSION END:

  1. SESSION SUMMARY:
     "Today's session summary:
      ✅ Chapters covered: [list]
      ✅ Questions attempted: [N] (Correct: [X]%)
      ✅ Concepts explained: [list]
      ⚠️ Weak areas identified: [list]
      📊 Mastery update: [subject] [old]% → [new]%"
  
  2. SCHEDULE REVIEWS:
     Add today's concepts to spaced repetition queue.
     "Scheduled reviews for today's topics:
      → Day 1 (tomorrow): Quick scan of [chapter] notes
      → Day 3: Active recall quiz
      → Day 7: Practice test"
  
  3. SUGGEST NEXT SESSION:
     "For your next session, I recommend:
      1. Start with /warm-up (20 min — recall maintenance)
      2. Continue [next chapter] from revision plan
      3. Do RD Sharma [chapter] Level 1 (selective practice)
      4. End with 1 CBQ from [weak chapter]"
  
  4. MENTOR ALERT (if needed):
     If concerning patterns detected (3+ days low scores, burnout signals):
     Flag for /generate-report to highlight to mentor.
  
  5. BOOK WORK QUEUE:
     "📚 Homework (before next session):
      → NCERT Ex [X] — complete remaining problems
      → RD Sharma [chapter] — Q1-10 from Level 1
      → Oswaal — 1 solved sample paper (time yourself)"
```

## ALWAYS-ON HOOKS (fire during every interaction)

```
HOOK 1: BOOK REFERENCE AUTO-INJECT
  Trigger: Any chapter/topic discussed
  Action: Auto-load book-navigator skill → append book recommendations
  Output: "📚 Book Work:" section in every response

HOOK 2: KEYWORD AWARENESS
  Trigger: Student writes any answer
  Action: Quick keyword-bank scan
  Output: Flag missing keywords (non-blocking — warning only)

HOOK 3: WORD BUDGET CHECK
  Trigger: Student writes any answer
  Action: Estimate word count vs mark value
  Output: "Your 3M answer is ~20 words — aim for 50-75 words"

HOOK 4: EXAM TIP APPEND
  Trigger: Any concept explanation
  Action: Append exam relevance
  Output: "📝 Board Tip: This appears as a [X]-mark [type] question"

HOOK 5: IA AWARENESS
  Trigger: Monthly check (if IA milestones approaching)
  Action: Remind about IA tasks
  Output: "⏰ IA Reminder: PT2 is next week — need to prepare"
```

## How This Makes CBSE Tools Truly Autonomous

```
WITHOUT hooks (manual mode):
  Student: "Explain electricity"
  AI: [explains electricity]
  Student: "Which book should I practice from?"
  AI: [suggests RD Sharma]
  Student: "Check my answer"
  AI: [evaluates]
  Student: "Why did I get this wrong?"
  AI: [explains mistake]
  Student: "What should I revise?"
  AI: [suggests chapters]
  → 6 manual interactions for 1 concept

WITH hooks (autonomous mode — like ECB):
  Student: "Explain electricity"
  AI: [explains electricity]
      + [auto: concept check Q]
      + [auto: 📚 NCERT Ex 12.1-12.3 → Oswaal PYQ → RD Sharma MCQ]
      + [auto: 📝 Board Tip: 5M LA question, draw circuit diagram]
      + [auto: scheduled for spaced repetition]
  Student: [answers concept check Q]
  AI: [auto-evaluates]
      + [auto: mistake DNA = Careless (sign error)]
      + [auto: keyword check = 4/6 keywords present]
      + [auto: mastery updated: Electricity 65% → 70%]
      + [auto: "📚 Similar problem: RD Sharma Ch 12, Q14"]
  → 2 interactions cover everything — system does the rest
```

