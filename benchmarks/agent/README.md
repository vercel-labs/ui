# Agent benchmark

How much work does it take an agent to use a screen? This benchmark gives an agent one task on the same project settings screen, built with several component libraries, and counts what it took: tool calls, text read, time, tokens and cost.

Each framework runs the screen three ways:

| Framework | Library | Tools         |
| --------- | ------- | ------------- |
| React     | Base UI | Browser tools |
| React     | Ark UI  | Browser tools |
| React     | ui-sdk  | Browser tools |
| React     | ui-sdk  | Agent tools   |
| Vue       | Reka UI | Browser tools |
| Vue       | ui-sdk  | Browser tools |
| Vue       | ui-sdk  | Agent tools   |
| Svelte    | Bits UI | Browser tools |
| Svelte    | ui-sdk  | Browser tools |
| Svelte    | ui-sdk  | Agent tools   |

Browser tools are how agents use most pages today: read the accessibility tree, click, type, press a key. Agent tools are the three tools a ui-sdk page gives an agent, `snapshot`, `query` and `act`, from [`@ui-sdk/core/agent`](../../apps/docs/content/docs/agents/index.mdx). The ui-sdk screen runs with both, so you can tell what the tools change apart from what the library changes.

## Results

Medians of three runs per row, with Sonnet through Claude Code, on November 15, 2026. Every run was correct.

### React

| Library | Tools   | Tool calls | Text read | Time | Tokens | Cost   |
| ------- | ------- | ---------- | --------- | ---- | ------ | ------ |
| Base UI | Browser | 17         | 41.0k     | 53 s | 291.7k | $0.139 |
| Ark UI  | Browser | 19         | 39.8k     | 65 s | 330.9k | $0.144 |
| ui-sdk  | Browser | 17         | 41.3k     | 56 s | 294.1k | $0.140 |
| ui-sdk  | Agent   | 7          | 7.0k      | 31 s | 69.5k  | $0.044 |

### Vue

| Library | Tools   | Tool calls | Text read | Time | Tokens | Cost   |
| ------- | ------- | ---------- | --------- | ---- | ------ | ------ |
| Reka UI | Browser | 16         | 34.0k     | 56 s | 226.5k | $0.113 |
| ui-sdk  | Browser | 17         | 41.3k     | 59 s | 294.3k | $0.140 |
| ui-sdk  | Agent   | 9          | 7.4k      | 34 s | 90.2k  | $0.051 |

### Svelte

| Library | Tools   | Tool calls | Text read | Time | Tokens | Cost   |
| ------- | ------- | ---------- | --------- | ---- | ------ | ------ |
| Bits UI | Browser | 17         | 36.2k     | 56 s | 259.1k | $0.123 |
| ui-sdk  | Browser | 17         | 41.3k     | 57 s | 294.3k | $0.141 |
| ui-sdk  | Agent   | 8          | 10.8k     | 30 s | 92.8k  | $0.056 |

With browser tools, the ui-sdk screen takes about as much as the others. The difference comes from the agent tools.

## The task

The screen has three tabs, 24 members with a menu on every row, a confirm dialog and an accordion of switches. The agent is asked to:

- rename the project to Atlas
- set the visibility to Internal
- make Priya Shah an admin
- remove Tom Becker and confirm
- in Email, turn Deploy failures on and Weekly digest off, and leave Slack alone
- save

A run is correct when the page saved once, with exactly those changes.

## Run it

You need the [Claude Code CLI](https://claude.com/claude-code), signed in, and Chromium for Playwright (`pnpm exec playwright install chromium`).

```sh
pnpm install
pnpm --filter agent-benchmark bench
pnpm --filter agent-benchmark bench --framework vue --runs 3
```

It starts the app, opens one browser window per row of the table above, side by side, and starts one agent in each at the same moment. When they finish it prints a table, and the median of every measure when there is more than one run.

| Flag          | Default  |                                             |
| ------------- | -------- | ------------------------------------------- |
| `--framework` | `react`  | `react`, `vue` or `svelte`.                 |
| `--runs`      | `1`      | How many times to run every row.            |
| `--model`     | `sonnet` | Any model the Claude Code CLI takes.        |
| `--headless`  |          | Run without windows.                        |
| `--width`     | `480`    | The width of each window.                   |
| `--out`       |          | Where to write results. A temporary folder. |

Results go to `results.json`, with every tool call an agent made in `calls.jsonl` beside it. Set `CHROMIUM` to use a browser of your own.

To look at a screen by hand, run `pnpm --filter agent-benchmark dev` and open `http://localhost:5410/?screen=react-ui-sdk`. Add `&agent` to put the agent tools on the page as `window.__agent`.

## What is measured

- **Tool calls:** every call the agent made, with the last one, `done`.
- **Text read:** the characters the tools returned.
- **Time:** from the agent's start to its last message.
- **Tokens and cost:** what Claude Code reported for the run.
- **Correct:** whether the page saved once with the right values.

## How it stays fair

- **One screen.** Every version renders the same fields from [`src/settings.ts`](src/settings.ts) with the same labels, and reports its save the same way.
- **Each library the way its docs show.** The screens are in [`src/screens`](src/screens), one file per library. If one could be written better, open a pull request.
- **One agent.** Every run gets the same task, the same short system prompt and one command it may run, in an empty folder. The prompt is in [`harness/task.mjs`](harness/task.mjs).
- **Tools as they ship.** The browser tools follow the Playwright MCP server's: a snapshot of the accessibility tree with refs, and actions that answer with the new snapshot. The agent tools come with the descriptions `agentTools` exports, word for word.

## Add a library

Write its screen in `src/screens/<framework>-<library>`, with the same labels as the others, and add a row to `frameworks` in [`harness/bench.mjs`](harness/bench.mjs).
