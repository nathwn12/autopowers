import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { tool } from '@opencode-ai/plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skillsDir = path.resolve(__dirname, '../../skills');

// ── Frontmatter extraction ──────────────────────────────────
const extractContent = (content) => {
  const match = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
  return match ? match[1] : content;
};

// ── Bootstrap cache ──────────────────────────────────────────
let bootstrapCache;

const getBootstrap = () => {
  if (bootstrapCache !== undefined) return bootstrapCache;

  const skillPath = path.join(skillsDir, 'using-autopowers', 'SKILL.md');
  if (!fs.existsSync(skillPath)) {
    bootstrapCache = null;
    return null;
  }

  const content = extractContent(fs.readFileSync(skillPath, 'utf8'));

  const toolMap = `**Tool Mapping for OpenCode:**
- \`TodoWrite\` → \`todowrite\`
- \`Task\` with subagents → \`task\` tool
- \`Read\`, \`Write\`, \`Edit\`, \`Bash\` → Your native tools

Use OpenCode's native \`skill\` tool to list and load skills.`;

  bootstrapCache = `<EXTREMELY_IMPORTANT>
${content}

${toolMap}
</EXTREMELY_IMPORTANT>`;

  return bootstrapCache;
};

// ── Shared subagent dispatch ─────────────────────────────────
async function dispatchSubagent(client, task, context, expectedOutput) {
  try {
    const session = await client.session.create({
      body: { title: `autopowers: ${task.replace(/[^a-zA-Z0-9 ]/g, '').slice(0, 60)}` },
    });

    const prompt = [
      `## Task`,
      task,
      ``,
      `## Context`,
      context,
      ``,
      `## Expected Output`,
      expectedOutput,
      ``,
      `Complete the task. When you finish, provide:`,
      `1. A brief summary of what you did`,
      `2. Any concerns or issues encountered`,
      `3. List of files changed`,
      ``,
      `If you need more context, say NEEDS_CONTEXT and explain what you need.`,
      `If you cannot complete the task, say BLOCKED and explain why.`,
    ].join('\n');

    const result = await client.session.prompt({
      path: { id: session.id },
      body: {
        parts: [{ type: 'text', text: prompt }],
      },
    });

    const responseText = result.parts
      ?.filter(p => p.type === 'text')
      .map(p => p.text)
      .filter(Boolean)
      .join('\n') || '';

    await client.session.delete({ path: { id: session.id } });

    let status = 'done';
    let output = responseText;
    let concerns = [];

    if (responseText.includes('BLOCKED')) {
      status = 'blocked';
    } else if (responseText.includes('NEEDS_CONTEXT')) {
      status = 'needs_context';
    } else if (responseText.includes('CONCERN:')) {
      status = 'done_with_concerns';
      concerns = responseText.match(/CONCERN:.*$/gm)?.map(c => c.replace('CONCERN:', '').trim()) || [];
    }

    const filesChanged = responseText.match(/(?:^|\n)(?:[\w.\-/\\]+\.[a-zA-Z0-9]+)/gm)
      ?.map(f => f.trim())
      .filter(f => !f.startsWith('CONCERN:') && !f.startsWith('NEEDS_CONTEXT') && !f.startsWith('BLOCKED'))
      .slice(0, 20) || [];

    return { status, output, concerns, files_changed: filesChanged };
  } catch (err) {
    return { status: 'blocked', output: `Subagent error: ${err.message}`, concerns: [] };
  }
}

// ── Plugin export ────────────────────────────────────────────
export const AutopowersPlugin = async ({ client }) => {
  return {

    // Register skills path so OpenCode discovers autopowers skills
    config: async (config) => {
      config.skills = config.skills || {};
      config.skills.paths = config.skills.paths || [];
      if (!config.skills.paths.includes(skillsDir)) {
        config.skills.paths.push(skillsDir);
      }
    },

    // Inject bootstrap into first user message
    'experimental.chat.messages.transform': async (_input, output) => {
      const bootstrap = getBootstrap();
      if (!bootstrap || !output.messages.length) return;

      const firstUser = output.messages.find(m => m.info?.role === 'user');
      if (!firstUser?.parts?.length) return;

      if (firstUser.parts.some(p => p.type === 'text' && p.text.includes('EXTREMELY_IMPORTANT'))) return;

      firstUser.parts.unshift({
        type: 'text',
        text: bootstrap,
      });
    },

    // ── 5 Custom Tools ──────────────────────────────────────
    tool: {

      // 1. delegate — single subagent
      delegate: tool({
        description: 'Dispatch a single focused task to a subagent. Returns structured result with status (done, blocked, needs_context). Use when a task is well-defined and self-contained.',
        args: {
          task: tool.schema.string().describe('The specific task for the subagent to complete'),
          context: tool.schema.string().describe('Background context: files, architecture, decisions, constraints'),
          expected_output: tool.schema.string().describe('What done looks like: file list, test output, decision'),
        },
        async execute(args) {
          const result = await dispatchSubagent(client, args.task, args.context, args.expected_output);
          return JSON.stringify(result);
        },
      }),

      // 2. delegate_many — parallel multi-subagent
      delegate_many: tool({
        description: 'Dispatch multiple independent tasks to subagents in PARALLEL. All tasks run simultaneously via Promise.all. Use for tasks that have no dependencies on each other.',
        args: {
          tasks: tool.schema.array(tool.schema.object({
            id: tool.schema.string().describe('Unique identifier for this task'),
            task: tool.schema.string().describe('What this subagent should do'),
            context: tool.schema.string().describe('Background context for this task'),
            expected_output: tool.schema.string().describe('What done looks like for this task'),
          })).describe('Array of independent tasks to run in parallel'),
        },
        async execute(args) {
          const results = await Promise.all(args.tasks.map(async (t) => {
            const result = await dispatchSubagent(client, t.task, t.context, t.expected_output);
            return { id: t.id, ...result };
          }));

          return JSON.stringify({
            results,
            summary: {
              total: results.length,
              completed: results.filter(r => r.status === 'done' || r.status === 'done_with_concerns').length,
              failed: results.filter(r => r.status === 'blocked').length,
              needs_context: results.filter(r => r.status === 'needs_context').length,
            },
          });
        },
      }),

      // 3. research — parallel research
      research: tool({
        description: 'Research multiple questions in parallel by dispatching independent research subagents. Each question gets a focused agent. Returns combined findings with synthesis.',
        args: {
          questions: tool.schema.array(tool.schema.object({
            id: tool.schema.string().describe('Unique identifier'),
            question: tool.schema.string().describe('The question to research'),
            scope: tool.schema.string().optional().describe('Optional narrowing scope'),
          })).describe('Questions to research in parallel'),
        },
        async execute(args) {
          const results = await Promise.all(args.questions.map(async (q) => {
            const task = `Research this question thoroughly:\n${q.question}`;
            const context = q.scope ? `Scope: ${q.scope}` : 'Be thorough and concise. Return key findings, data points, and sources.';
            const result = await dispatchSubagent(client, task, context, 'Key findings, data points, sources, and recommendations');
            return { id: q.id, question: q.question, ...result };
          }));

          return JSON.stringify({
            findings: results,
            synthesis: 'Research complete. Review individual findings above.',
          });
        },
      }),

      // 4. explore — codebase analysis
      explore: tool({
        description: 'Analyze the project codebase to answer structural questions. Uses SDK file operations to understand directory layout, key files, and patterns. Call this before planning to understand what exists.',
        args: {
          query: tool.schema.string().describe('What to understand: "project structure", "API routes", "database schema", "component tree"'),
          focus: tool.schema.string().optional().describe('Optional narrowing: directory path, file pattern, or topic'),
        },
        async execute(args) {
          const worktree = process.cwd();
          let result = `Codebase exploration for: ${args.query}\n\n`;

          // Top-level listing
          try {
            const items = fs.readdirSync(worktree, { withFileTypes: true });
            result += '## Top-level contents\n';
            for (const item of items) {
              if (item.name.startsWith('.') && item.name !== '.gitignore') continue;
              result += `${item.isDirectory() ? '/' : ''} ${item.name}\n`;
            }
            result += '\n';
          } catch {}

          // Walk src/ if it exists (up to 3 levels)
          try {
            const srcDir = path.join(worktree, 'src');
            if (fs.existsSync(srcDir)) {
              result += '## src/ directory\n';
              const walk = (dir, depth) => {
                if (depth > 3) return;
                const entries = fs.readdirSync(dir, { withFileTypes: true });
                for (const entry of entries) {
                  if (entry.name.startsWith('.')) continue;
                  const full = path.join(dir, entry.name);
                  const indent = '  '.repeat(depth);
                  if (entry.isDirectory()) {
                    result += `${indent}${entry.name}/\n`;
                    walk(full, depth + 1);
                  } else {
                    result += `${indent}${entry.name}\n`;
                  }
                }
              };
              walk(srcDir, 0);
            }
          } catch {}

          // Focus path
          if (args.focus) {
            const focusPath = path.resolve(worktree, args.focus);
            result += `\n## Focus: ${args.focus}\n`;
            if (fs.existsSync(focusPath)) {
              const stat = fs.statSync(focusPath);
              if (stat.isDirectory()) {
                const items = fs.readdirSync(focusPath);
                result += items.join('\n') + '\n';
              } else {
                const content = fs.readFileSync(focusPath, 'utf8').slice(0, 3000);
                result += '```\n' + content + '\n```\n';
              }
            } else {
              result += '(path not found)\n';
            }
          }

          return JSON.stringify({ structure: result, summary: `Explored ${args.query}` });
        },
      }),

      // 5. verify — compliance check
      verify: tool({
        description: 'Compare implementation against requirements. Returns structured pass/fail per requirement, flags extras (YAGNI). Use after execution to check if work meets the plan.',
        args: {
          requirements: tool.schema.string().describe('The spec, plan, or requirements text — line by line requirements'),
          implementation_context: tool.schema.string().describe('What was built: file list, summary of changes, or diff'),
        },
        async execute(args) {
          const reqs = args.requirements.split('\n').filter(r => r.trim().length > 0);
          const implemented = args.implementation_context;

          const met = [];
          const unmet = [];
          const extras = [];

          for (const req of reqs) {
            const trimmed = req.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            const normal = trimmed.replace(/^-\s*\[\s*[x ]?\s*\]\s*/i, '').trim();
            if (!normal) continue;
            if (implemented.toLowerCase().includes(normal.toLowerCase())) {
              met.push(trimmed);
            } else {
              unmet.push(trimmed);
            }
          }

          const implLines = implemented.split('\n').map(l => l.trim()).filter(Boolean);
          for (const line of implLines) {
            const normal = line.replace(/^-\s*\[\s*[x ]?\s*\]\s*/i, '').trim();
            if (!normal || normal.startsWith('#')) continue;
            const mentioned = reqs.some(r => {
              const rn = r.trim().replace(/^-\s*\[\s*[x ]?\s*\]\s*/i, '').trim();
              return rn && normal.toLowerCase().includes(rn.toLowerCase());
            });
            if (!mentioned) extras.push(normal);
          }

          return JSON.stringify({
            compliant: unmet.length === 0,
            requirements_met: met,
            requirements_unmet: unmet,
            extras_built: extras,
            summary: `${met.length}/${reqs.length} requirements met, ${extras.length} extras flagged`,
          });
        },
      }),

    },
  };
};
