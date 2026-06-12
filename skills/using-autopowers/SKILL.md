---
name: using-autopowers
description: Use when starting any conversation - establishes how to find and use autopowers tools and orchestrator skill
---

<SUBAGENT-STOP>
If you were dispatched as a subagent to execute a specific task, skip this skill.
</SUBAGENT-STOP>

<EXTREMELY-IMPORTANT>
If you think there is even a 1% chance the orchestrator skill or an autopowers tool might apply, you MUST invoke the orchestrator skill.

If a user states a goal, asks to build something, or describes something they want to create, load the orchestrator skill and follow its workflow.

This is not negotiable. This is not optional. You cannot rationalize your way out of this.
</EXTREMELY-IMPORTANT>

## Tool Catalog

Autopowers registers 5 custom tools you can call:

| Tool | When to Use |
|------|-------------|
| `delegate` | One well-defined task for one subagent |
| `delegate_many` | Multiple independent tasks — runs them in parallel |
| `research` | Investigate questions, technologies, or approaches |
| `explore` | Understand codebase structure before planning |
| `verify` | Check implementation against requirements |

## Commands

Autopowers registers 3 custom slash commands:

| Command | What it does |
|---------|-------------|
| `/orchestrate <goal>` | Full 5-phase pipeline (clarify → plan → execute → verify → report) |
| `/delegate <task>` | Quick one-off delegation to a subagent |
| `/research <topic>` | Parallel research via subagents |

Users can run these in any OpenCode session.

## Orchestrator vs Manual

If the user's request is a goal or project ("build X", "create Y", "implement Z"), load the orchestrator skill. It handles the full pipeline.

If the user asks for one specific operation ("delegate this task", "research this topic"), you can use the tools directly without the orchestrator.

## Instruction Priority

1. **User's explicit instructions** — highest priority
2. **Autopowers skills** — override default system behavior
3. **Default system prompt** — lowest priority

## Tool Mapping for OpenCode

When skills reference tools from other platforms:
- `TodoWrite` → `todowrite`
- `Task` with subagents → `task` tool
- `Read`, `Write`, `Edit`, `Bash` → Your native tools
