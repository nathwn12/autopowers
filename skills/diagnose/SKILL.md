---
name: diagnose
description: Use when encountering any bug, test failure, or unexpected behavior, before proposing fixes
---

# Diagnose

A discipline for hard bugs. Skip phases only when explicitly justified.

**Core principle:** ALWAYS find root cause before attempting fixes. Symptom fixes are failure.

## Phase 1 — Build a Feedback Loop

**This is the skill.** Everything else is mechanical. If you have a fast, deterministic, agent-runnable pass/fail signal for the bug, you will find the cause. If you don't have one, no amount of staring at code will save you.

Spend disproportionate effort here. **Be aggressive. Be creative. Refuse to give up.**

### Constructing a Loop

1. **Failing test** at whatever seam reaches the bug
2. **CLI invocation** with fixture input, diffing stdout against known-good snapshot
3. **Headless browser** (Playwright) — drives UI, asserts on DOM/console/network
4. **Throwaway harness** — minimal subset of system exercising the bug code path
5. **Property/fuzz loop** — run 1000 random inputs, look for failure mode
6. **Differential loop** — same input through old vs new version, diff outputs

### Iterate on the Loop

Once you have *a* loop, ask:
- Can I make it faster? (Cache setup, narrow scope)
- Can I make the signal sharper? (Assert on symptom, not crash)
- Can I make it more deterministic? (Pin time, seed RNG, isolate filesystem)

A 30-second flaky loop is barely better than nothing. A 2-second deterministic loop is a debugging superpower.

### When You Cannot Build a Loop

Stop and say so explicitly. List what you tried. Ask the user for: access to the reproduction environment, a captured artifact (HAR, log dump, core dump), or permission to add temporary instrumentation.

Do **not** proceed to hypothesise without a loop.

## Phase 2 — Reproduce

Run the loop. Watch the bug appear.

Confirm:
- The loop produces the failure mode the **user** described — not a different failure nearby
- The failure is reproducible across multiple runs
- You have captured the exact symptom

## Phase 3 — Hypothesise

Generate **3-5 ranked hypotheses** before testing any of them. Single-hypothesis generation anchors on the first plausible idea.

Each hypothesis must be **falsifiable**: state the prediction it makes.

> "If <X> is the cause, then <changing Y> will make the bug disappear."

If you cannot state the prediction, the hypothesis is a vibe — discard or sharpen it.

**Show the ranked list to the user before testing.** They often have domain knowledge that re-ranks instantly.

## Phase 4 — Instrument

Each probe must map to a specific prediction from Phase 3. **Change one variable at a time.**

Tool preference:
1. **Debugger / REPL inspection** — one breakpoint beats ten logs
2. **Targeted logs** at boundaries that distinguish hypotheses
3. Never "log everything and grep"

**Tag every debug log** with a unique prefix, e.g. `[DEBUG-a4f2]`. Cleanup becomes a single grep.

For performance regressions: establish a baseline measurement first, then bisect. Logs are usually wrong for perf.

## Phase 5 — Fix + Regression Test

Write the regression test **before the fix** — at the correct seam. If no correct seam exists, that itself is the finding: the codebase architecture prevents locking down this bug.

1. Turn the minimised repro into a failing test at that seam
2. Watch it fail
3. Apply the fix
4. Watch it pass
5. Re-run the Phase 1 feedback loop against the original scenario

## Phase 6 — Cleanup

Before declaring done:
- Original repro no longer reproduces
- Regression test passes
- All `[DEBUG-...]` instrumentation removed
- The correct hypothesis is stated in the commit message

**Then ask: what would have prevented this bug?** If the answer involves architectural change, note it for the architecture skill.

## Red Flags — STOP

- Proposing fixes before data flow is traced
- "Quick fix for now, investigate later"
- "Just try changing X and see if it works"
- "One more fix attempt" (when already tried 2+)
- Each fix reveals a new problem in a different place

**All of these mean: STOP. Return to Phase 1.**
