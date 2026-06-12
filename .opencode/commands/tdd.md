---
description: TDD red-green-refactor — iron law: no code without failing test
subtask: true
---

The user wants to develop using TDD:
$ARGUMENTS

Load the `tdd` skill. The Iron Law applies: NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST.

RED — write one failing test (one behavior, clear name, real code). VERIFY RED — watch it fail.

GREEN — write minimal code to pass. No extra features. VERIFY GREEN — watch it pass, all tests green.

REFACTOR — clean up. Keep tests green.

One behavior per cycle. Do not write all tests first (horizontal slices = not TDD).
