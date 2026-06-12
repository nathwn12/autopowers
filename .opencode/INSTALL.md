# Installing Autopowers

## Prerequisites

- [OpenCode](https://opencode.ai) installed

## Install

Add autopowers to your `opencode.json` (global at `~/.config/opencode/opencode.json` or project-level):

```json
{
  "plugin": ["autopowers@git+https://github.com/nathwn12/autopowers.git"]
}
```

Restart OpenCode. The plugin installs automatically through OpenCode's plugin manager.

Verify by asking:
```
I want to build something. What tools do you have?
```

## Updating

```json
{
  "plugin": ["autopowers@git+https://github.com/nathwn12/autopowers.git#v1.0.0"]
}
```

Pin to a specific commit or tag with `#ref` syntax. To update to the latest,
remove the `#ref` and restart OpenCode.

If updates don't appear, clear OpenCode's package cache:

```bash
rm -rf ~/.cache/opencode/node_modules/autopowers
```

## Troubleshooting

### Plugin not loading

1. Check logs: `opencode run --print-logs "hello" 2>&1 | grep -i autopowers`
2. Verify the plugin line in your `opencode.json`
3. Make sure you're running a recent version of OpenCode

### Skills not found

1. Use the `skill` tool to list what's discovered
2. Check that the plugin is loading (see above)

## Windows

If git-backed plugin installs have issues, try:

```powershell
npm install autopowers@git+https://github.com/nathwn12/autopowers.git --prefix "$HOME\.config\opencode"
```

Then use the local path:

```json
{
  "plugin": ["~/.config/opencode/node_modules/autopowers"]
}
```
