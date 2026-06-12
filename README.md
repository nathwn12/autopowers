# Regent

**From idea to shipped — zero ceremony.**

Regent is an OpenCode plugin that gives your coding agent self-managing orchestration. You state a goal. The agent clarifies it, plans it, dispatches subagents in parallel, verifies results, and reports back with options — all autonomously.

Named for one who governs on behalf of another: the AI governs development on your behalf.

## How It Works

```
You: "Build a CLI tool to convert markdown to PDF"

1. CLARIFY  → Agent asks questions until your goal is crisp
2. PLAN     → Agent decomposes into tasks, identifies parallel work
3. EXECUTE  → Agent dispatches subagents (parallel for independent tasks)
4. VERIFY   → Agent checks results against the original requirements
5. REPORT   → Agent summarizes concisely with next-step options
```

Regent runs independent tasks in PARALLEL via `delegate_many()` — not sequentially. Maximum throughput, minimum waiting.

**No phase skip. No verification without evidence. No scope creep without consent.**

## Installation

Add to your global or project `opencode.json`:

```json
{
  "plugin": ["regent@git+https://github.com/nathwn12/regent.git"]
}
```

Restart OpenCode. That's it.

## Requirements

- OpenCode (any recent version)
- No other dependencies — `@opencode-ai/plugin` ships with OpenCode

## Quick Start

Using slash commands (recommended):

```
/orchestrate Build a CLI tool that watches a directory and auto-formats new files.
```

Or for quick one-off tasks:

```
/delegate Search the codebase for all API route definitions and summarize them.
/research What are the best Rust libraries for CLI argument parsing?
/tdd "I want to add a password strength validator"
/diagnose "The build script sometimes hangs on Windows"
/verify "Check my latest commit against the requirements"
```

Without commands — just state a goal:

```
I want to build a CLI tool that watches a directory and auto-formats new files.
```

Regent will:
1. Load the orchestrator skill automatically
2. Ask clarifying questions until your goal is crisp
3. Call `explore()` to understand your project, `research()` for library decisions
4. Create a plan with dependency-ordered tasks and present it for approval
5. Execute tasks — `delegate_many()` for parallelizable work, `delegate()` for sequential
6. Call `verify()` against the original requirements
7. Report concisely with 2-3 options for next steps

## Slash Commands

| Command | What it does |
|---------|-------------|
| `/orchestrate <goal>` | Full 5-phase pipeline (clarify → plan → execute → verify → report) |
| `/delegate <task>` | Quick one-off delegation to a subagent |
| `/research <topic>` | Parallel research via subagents |
| `/tdd <feature>` | TDD red-green-refactor cycle |
| `/diagnose <symptom>` | Systematic debugging with feedback loop |
| `/verify <scope>` | Compliance check against requirements |

## Custom Tools

| Tool | Purpose | Parallel? |
|------|---------|-----------|
| `delegate` | Single task → one subagent | No |
| `delegate_many` | N independent tasks → N parallel subagents | Yes — `Promise.all()` |
| `research` | Parallel investigation of topics | Yes |
| `explore` | Codebase structure analysis | No |
| `verify` | Compliance check against requirements | No |

## Loadable Skills

| Skill | When to Load |
|-------|-------------|
| `using-regent` | Injected automatically at session start — establishes tool catalog and 1% rule |
| `orchestrator` | User states a goal — runs the 5-phase pipeline |
| `tdd` | Writing implementation code — enforces red-green-refactor |
| `diagnose` | Bug, test failure, or unexpected behavior — builds feedback loop first |
| `verification-before-completion` | Before claiming work is done — evidence gate |

## Principles

- **Throughput first** — Independent tasks run in parallel. Always.
- **Goal-locked** — Every task traces back to the clarified goal. No scope creep.
- **Evidence before claims** — Verification commands run fresh before any success claim.
- **Human at decision points** — The agent pauses for direction only when blocked or at natural choice boundaries.
- **Zero ceremony** — No config files, no setup. Install the plugin, state a goal, go.

## License

MIT — Copyright (c) 2026 nathwn12
