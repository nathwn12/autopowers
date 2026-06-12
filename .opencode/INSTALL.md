# Installation

## Add to opencode.jsonc

```jsonc
{
  "plugin": "regent@git+https://github.com/nathwn12/regent.git"
}
```

## Pin a version

```jsonc
{
  "plugin": "regent@git+https://github.com/nathwn12/regent.git#v2.1.0"
}
```

## Verify

Start a new session. The AutoPowers bootstrap injects automatically. Run `/orchestrate` to test.

## Troubleshooting

**Plugin not loading:**
- Make sure the URL is correct and the repo is accessible
- Restart the OpenCode session

**Skills not found:**
- Verify the plugin installed correctly — check `~/.cache/opencode/packages/regent@git+https_*/node_modules/regent/skills/`

**Orchestrator not auto-triggering:**
- The orchestrator loads on `/orchestrate` or when user states a goal
- The bootstrap skill injects into the first user message of every session
