---
name: ui-sdk
description: Builds interfaces with ui-sdk in React, Vue, Svelte, Solid or web components. Covers choosing and composing its components, building a component or behavior it doesn't ship from @ui-sdk/core (like a stepper, splitter, transfer list or emoji picker), making the interface usable by agents through createAgent, agent tools and WebMCP, and testing keyboard, focus, ARIA, server rendering and right to left. Use whenever a project has @ui-sdk/* installed or the user mentions ui-sdk.
---

# Build with ui-sdk

ui-sdk is a library of UI behaviors: keyboard navigation, focus, selection, dismissal, popups, drag and drop and the ARIA they need. Its components are built from those behaviors and ship unstyled in React, Vue, Svelte, Solid and web components. When a component is missing, you build it from the same behaviors in `@ui-sdk/core`, and it gets the same keyboard, focus, server rendering and right to left support.

## Read first

The docs for the installed version ship in each package, as Markdown:

- `node_modules/@ui-sdk/<framework>/docs/llms.txt` is the index. Read it first. `<framework>` is `react`, `vue`, `svelte`, `solid` or `web`.
- Then read only the pages your task needs, like `docs/components/select.md`. Don't read the whole `docs/` folder; it's large.
- `docs/core.md` and `docs/rendering.md` cover building your own components.

The same docs are online at https://ui-sdk.dev/docs. Prefer the installed copy: it matches the version in the project.

If no `@ui-sdk` package is installed yet, install `@ui-sdk/core` and the framework's package with the project's package manager.

## Pick your path

1. **Build an interface from our components**, like a settings page, a form or a command palette: read [references/build-interface.md](references/build-interface.md).
2. **Build a component or behavior ui-sdk doesn't ship**, or extend one of ours: read [references/create-component.md](references/create-component.md).

Most interfaces only need path 1. When one part of it needs a component we don't have, follow path 2 for that part.

Every path ends the same way:

3. **Make it agent-ready**: [references/agent-ready.md](references/agent-ready.md).
4. **Test it**: [references/testing.md](references/testing.md).

## Rules for every path

- **Import from entries.** Each component has its own entry, like `@ui-sdk/react/select`. There's no root import from a framework package. Never import `@ui-sdk/core/internal/*`.
- **One shape everywhere.** A root and its parts, nested as the component page's Composition shows. Change a part's element with `render`, never an `as` prop.
- **Default or controlled.** `defaultValue` to start, or `value` with `onValueChange(value, details)` to control it (each framework's idiom: `v-model` in Vue, `bind:value` in Svelte, properties and events in web components). `details` has `reason`, `source` and `cancel()`.
- **Name every control.** Use the component's label part (`FieldLabel`, `SelectLabel`, `DialogTitle`), or `aria-label` when there's no visible text. People using screen readers and agents both find controls by name.
- **Style from state.** Target `data-slot` and state attributes like `data-open` or `data-pressed`, and the CSS variables each component lists. Never inline styles for state, and never generated ids.
- **Declare the ui-sdk layer.** Put `@layer ui-sdk;` at the top of the global stylesheet, above `@import "tailwindcss"` if there is one.
- **Key lists by value or id**, never by index.
- **Right to left needs no provider.** Components read the direction from the page.
- **Don't hand-roll what we ship.** A `div` with `role="listbox"`, `"menu"`, `"dialog"` or `"tablist"` next to an installed ui-sdk package is almost always a bug.

## When you're done

1. **Typecheck.** If the root `tsconfig.json` has `"files": []` and `references`, `npx tsc --noEmit` checks nothing: run `npx tsc -b` or `npx tsc --noEmit -p <app config>`. For Svelte, run `svelte-check`; for Vue, `vue-tsc`.
2. **Run the tests** you wrote (see testing.md).
3. **Report** each command you ran with its exit code, and anything you couldn't check.
4. **Write gaps to `GAPS.md`** at the project root, one line each: anything the docs or types got wrong or left out, and what it cost you (a failed test, a probe, a guess). Write "No gaps" if there were none.
