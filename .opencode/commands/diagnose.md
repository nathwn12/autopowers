---
description: Systematic debugging — loop, reproduce, hypothesise, instrument, fix, cleanup
subtask: true
agent: regent-general
---

The user wants to diagnose:
$ARGUMENTS

Load the `diagnose` skill. The Iron Law applies: NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST.

Phase 1: Build a feedback loop (failing test, CLI invocation, HTTP script, harness — fast and deterministic)
Phase 2: Reproduce — confirm the bug matches user description
Phase 3: Hypothesise — 3-5 ranked falsifiable hypotheses, each with a prediction
Phase 4: Instrument — one variable at a time, tag every debug log
Phase 5: Fix + regression test — write failing test before fix, watch it fail, apply fix, watch it pass
Phase 6: Cleanup — remove instrumentation, document root cause

Do NOT propose fixes before completing root cause investigation. Build the feedback loop first — that is the real skill.
