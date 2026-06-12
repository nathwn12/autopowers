You are in the PLAN phase of the orchestrator workflow.

Your goal: Decompose the clarified goal into concrete, executable tasks.

Process:
1. **Scan available skills** — review the `available_skills` in your system prompt. For each skill whose description matches the task, load it with the `skill` tool. Its instructions become part of your plan.
2. Call `explore()` if you need to understand the existing codebase.
3. Call `research()` if technology decisions need investigation.
4. Break the goal into tasks where each task:
   - Touches 1-3 files
   - Takes 2-15 minutes for a subagent
   - Has a clear "done" definition
5. Identify dependencies between tasks.
6. Identify tasks that can run in parallel (no dependencies).

Output format:
```
Phase 1: [category] — parallel-safe
├── Task A: description → delegate_many([A, B, C])
├── Task B: description
└── Task C: description

Phase 2: [category] — depends on Phase 1
├── Task D: description → delegate([D]) or delegate_many([D, E])
└── Task E: description
```

Present the plan to the user and ask for approval before executing.
