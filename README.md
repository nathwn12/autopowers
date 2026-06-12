# Autopowers

**From idea to shipped — zero process management.**

Autopowers is an OpenCode plugin that gives your coding agent self-managing
orchestration. You state a goal. The agent clarifies it, plans it, dispatches
subagents in parallel, verifies results, and reports back with options — all
autonomously.

## How It Works

```
You: "Build a CLI tool to convert markdown to PDF"

1. CLARIFY  → Agent asks questions until your goal is crisp
2. PLAN     → Agent decomposes into tasks, identifies parallel work
3. EXECUTE  → Agent dispatches subagents (parallel for independent tasks)
4. VERIFY   → Agent checks results against the original requirements
5. REPORT   → Agent summarizes concisely with next-step options
```

Autopowers runs independent tasks in PARALLEL via `delegate_many()` — not
sequentially. Maximum throughput, minimum waiting.

## Installation

Add to your global or project `opencode.json`:

```json
{
  "plugin": ["autopowers@git+https://github.com/nathwn12/autopowers.git"]
}
```

Restart OpenCode. That's it.

## Requirements

- OpenCode (any recent version)
- No other dependencies — `@opencode-ai/plugin` ships with OpenCode

## Quick Start

### Using slash commands (recommended)

```
/orchestrate Build a CLI tool that watches a directory and auto-formats new files.
```

Or for quick one-off tasks:

```
/delegate Search the codebase for all API route definitions and summarize them.
/research What are the best Rust libraries for CLI argument parsing?
```

### Without commands

Start a new OpenCode session and type:

```
I want to build a CLI tool that watches a directory and auto-formats new files.
```

Autopowers will:
1. Ask clarifying questions (features, languages, constraints)
2. Scan available skills, load matching ones
3. Call `explore()` to check your existing project
4. Call `research()` if needed for library recommendations
5. Create a plan and present it for your approval
6. Execute tasks — calling `delegate_many()` for parallelizable work
7. Call `verify()` to check everything
8. Report what was built and suggest what to do next

## Slash Commands

| Command | What it does |
|---------|-------------|
| `/orchestrate <goal>` | Full 5-phase pipeline (clarify → plan → execute → verify → report) |
| `/delegate <task>` | Quick one-off delegation to a subagent |
| `/research <topic>` | Parallel research via subagents |

## Custom Tools

| Tool | Purpose |
|------|---------|
| `delegate` | Single task → one subagent |
| `delegate_many` | N independent tasks → N parallel subagents |
| `research` | Parallel investigation of topics |
| `explore` | Codebase structure analysis |
| `verify` | Compliance check against requirements |

## License

MIT — Copyright (c) 2026 nathwn12
