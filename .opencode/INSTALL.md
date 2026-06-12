# Installing Regent

## Prerequisites

- [OpenCode](https://opencode.ai) installed

## Install

Add regent to your `opencode.json` (global at `~/.config/opencode/opencode.json` or project-level):

```json
{
  "plugin": ["regent@git+https://github.com/nathwn12/regent.git"]
}
```

Restart OpenCode. The plugin installs automatically through OpenCode's plugin manager.

Verify by stating a goal:

```
I want to build a CLI tool that watches a directory and auto-formats new files.
```

The agent should load the orchestrator skill and begin clarifying — not jump into code.

## Updating

```json
{
  "plugin": ["regent@git+https://github.com/nathwn12/regent.git#v2.0.0"]
}
```

Pin to a specific commit or tag with `#ref` syntax. To update to the latest, remove the `#ref` and restart OpenCode.

If updates don't appear, clear OpenCode's package cache:

```bash
rm -rf ~/.cache/opencode/node_modules/regent
```

## Troubleshooting

### Plugin not loading

1. Check logs: `opencode run --print-logs "hello" 2>&1 | grep -i regent`
2. Verify the plugin line in your `opencode.json`
3. Make sure you're running a recent version of OpenCode

### Skills not found

1. Use the `skill` tool to list what's discovered
2. Check that the plugin is loading (see above)

### Orchestrator doesn't auto-trigger

The bootstrap skill is injected into the first user message. If it doesn't appear:
- Check if another plugin is conflicting with the messages.transform hook
- Verify the skills directory is discoverable

## Windows

If git-backed plugin installs have issues, try:

```powershell
npm install regent@git+https://github.com/nathwn12/regent.git --prefix "$HOME\.config\opencode"
```

Then use the local path:

```json
{
  "plugin": ["~/.config/opencode/node_modules/regent"]
}
```
