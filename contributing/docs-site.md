# The docs site

`apps/docs` is a Next.js app with Fumadocs. It serves the docs, the compiled examples and the Markdown files agents read.

## Running it

- `pnpm dev` runs `scripts/docs-dev.sh`: it builds the examples, starts the docs on `localhost:5400` (`DOCS_PORT` changes it), and rebuilds a framework's examples within seconds of a change to its examples or adapter. A change to core rebuilds them all. Reload to see it.
- `pnpm docs:prod` builds the examples and the docs and serves the production build, which is what to browse when you want every page fast.
- `pnpm test:docs` opens every example in every framework and checks the docs pages. It needs the docs server on 5400.

## Layout

- `apps/docs/content/docs/` has one folder per section: `core` and `agents`, which are shared across frameworks, and `react`, `vue`, `svelte`, `solid` and `web-components`, one full copy of the docs per framework.
- A framework's docs have no `<Framework only>` blocks. A page differs per framework in its own copy, so an edit that holds for every framework is made in each copy. A component a framework doesn't have gets no page there.
- Core and Agents link to a framework's pages without naming one, like `/docs/components/field`, which redirects to the framework the reader last read (a cookie its pages set), else React. The sidebar's section switcher keeps the page between frameworks.
- Each section's order is its `meta.json`.

## Component pages

- One page per framework: `apps/docs/content/docs/<framework>/components/<name>.mdx`. Write React's first, then copy it to each framework and rewrite only what differs: installation, anatomy, code, callback names (`@open-change` in Vue, the `openchange` event on web components) and framework notes.
- Examples render with `<ComponentExample name="<name>/<example>" />`.
- The API reference comes from the code: `<TypeTable path="../../packages/core/src/components/<name>/<name>.ts" name="..." />`, `<StateTable>`, `<ReasonTable>` and `<ControllerTable>` (same `path` and `name` props, read from the exported types), `<DataAttributes component="<name>" />`, `<CssVariables>` and `<SpecList spec="<name>" />`, which lists behavior from spec titles.
- `TypeTable` example links use heading text in the `examples` map. When renaming a heading, update these maps and incoming fragment links too.
- Add the component to `tests/docs/props.spec.ts`, which checks that every exported prop and state field appears in at least one React example.

## Examples

- Laid out framework first, with the same example names in every framework, each doing the same thing. `pnpm test:docs` fails if a folder is missing one.

  ```
  examples/<name>/react/<example>.tsx     exports Example
  examples/<name>/vue/<example>.vue
  examples/<name>/svelte/<example>.svelte
  examples/<name>/solid/<example>.tsx     exports Example
  examples/<name>/web/<example>.ts        exports mount(root)
  ```

- Next never compiles the examples. `examples/vite.config.ts` builds each framework's, with the framework and the SDK bundled, to `apps/docs/public/examples/<framework>` (`pnpm --filter examples build`, or `node scripts/build.mjs react vue` in `examples` for some). They're static files, so the CDN serves them. `ComponentExample` preloads every file an example imports, from Vite's manifest, so the browser fetches them with the page instead of one import at a time, and `ExamplePreview` imports the example and its framework's `mount.js` once the page hydrates. A web example's `mount(root)` may return a cleanup, which the preview calls.
- `apps/docs/public/examples` is gitignored, so a deploy runs `pnpm --filter examples build` before `next build`.
- Examples render in the page, not in an iframe, so overlays and focus behave as they do in apps.
- Example code renders as Shiki's HTML, one element per block.
- How to style them is in [examples.md](examples.md).

## Core and Agents

- `/docs/core` explains building components from core. Shared pages can use `FrameworkContent` for framework-specific snippets, as Preferences does. Each framework's Rendering page covers rendering primitives in that framework.
- Core's Reference is generated from `packages/core/src/index.ts` (`apps/docs/lib/core-exports.ts`), so a new export appears with its JSDoc.
- The walkthrough's code blocks are extracted from Compose Behaviors and the framework's Rendering page, and run by `packages/react/test/docs-walkthrough.test.tsx` and `packages/web/test/docs-walkthrough.test.ts`. Edit the pages and the tests together.
- A new public block gets its own page under `core/`, an entry in its section's `meta.json`, and a mention on the Behaviors overview.

## Markdown for agents

- `/docs/core.md` and `/docs/agents.md` serve each section as one Markdown file (`lib/section-markdown.ts`), and `/llms.txt` points to them.
- `/docs/<framework>/llms.txt` (`app/docs/[section]/llms.txt/route.ts`, `lib/llms.ts`) is where an agent starts building with that framework: its guides whole, then an index of every component with its import and a link to its page, then its utilities in compact form (`pageMarkdown(..., { compact: true })`). It stays small enough to read in one go.
- `pnpm release` writes the same docs as Markdown into each package's `docs/` folder (gitignored) with `scripts/package-docs.mjs`, so the docs reach whoever installs a package. It bundles `apps/docs/lib/package-docs.ts` and reads the same MDX and tables as the site, so a new docs tag needs a Markdown case in `apps/docs/lib/page-markdown.ts`. A table's data lives in `apps/docs/lib`, its rendering in `apps/docs/components`.
- `@ui-sdk/web` also ships `custom-elements.json` and VS Code's `html-custom-data.json`, generated from the real define calls by `apps/docs/lib/custom-elements.ts`. Descriptions come from the docs page's summary and the comment above each define call, so write that comment for users. `packages/web/test/custom-elements.test.ts` fails on any attribute, property, event or method without a description. A slot takes its part's public prop type, never an inline copy, or the JSDoc doesn't reach the manifest.

## Writing

Follow [Writing Website Docs](docs-writing.md) for prose, page scope, examples, and captions. Agents writing or reviewing these pages use [ui-sdk-write-docs](../.agents/skills/ui-sdk-write-docs/SKILL.md).
