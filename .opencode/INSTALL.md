# Installation

## Add to opencode.json

```json
{
  "plugin": "https://github.com/nathwn12/regent.git"
}
```

## Pin a version

```json
{
  "plugin": "https://github.com/nathwn12/regent.git#v2.0.0"
}
```

## Verify

Start a new session. You should see the AutoPowers bootstrap message. Run `/orchestrate` to test.

## Troubleshooting

**Plugin not loading:**
- Check that `opencode.json` is valid JSON (comments not allowed)
- Run `npm install --prefix .opencode` from the project root
- Restart the OpenCode session

**Skills not found:**
- Verify the skills directory path is correct in the plugin config
- Skills should be at `skills/<name>/SKILL.md` relative to the repo root

**Orchestrator not auto-triggering:**
- The orchestrator loads on the `/orchestrate` command or when user states a goal
- Make sure the bootstrap skill is injected (check first session message)

**Windows:**
- Git-backed plugin installs may need `npm install --prefix .opencode` run manually
- Paths use forward slashes in `opencode.json` even on Windows
