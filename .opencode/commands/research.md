---
description: Research a topic using parallel subagents
subtask: true
agent: regent-general
---

The user wants to research:
$ARGUMENTS

Call the `research` tool. Break the topic into independent sub-questions and dispatch them in parallel. Each sub-question gets its own focused agent.

Report findings to the user: key answers per sub-question, any contradictions, and a synthesis paragraph.
