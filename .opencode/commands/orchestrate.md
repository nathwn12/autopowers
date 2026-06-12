---
description: Run the full regent pipeline — clarify, plan, execute, verify, report
subtask: true
---

You are entering the regent orchestration pipeline.

The user's goal:
$ARGUMENTS

Load the `orchestrator` skill and follow its 5-phase workflow:
1. CLARIFY — ask focused questions until the goal is crisp
2. PLAN — decompose into tasks, scan available skills, identify parallelization
3. EXECUTE — dispatch subagents (`delegate_many()` for parallel work)
4. VERIFY — check results against the clarified requirements
5. REPORT — concise summary with options for what to do next

Do not skip any phase. Do not proceed without user approval at CLARIFY and PLAN gates.
