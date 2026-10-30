# playground

The page the Playwright specs in `tests/` run against. Each fixture renders one component in one framework, so the same spec checks React, Vue and web components.

```bash
pnpm dev
```

This starts Vite on port 5300. Set `PLAYGROUND_PORT` to run more than one at a time.

## Fixtures

The root page, `http://localhost:5300/`, lists every fixture with a link per framework. Open one directly with the `fixture` and `framework` query params:

```
http://localhost:5300/?fixture=menu&framework=react
```

That loads `src/fixtures/menu/react.tsx`. Each fixture directory holds one file per framework:

- `react.tsx`, `vue.ts`, `web.ts`: the component built with markup.
- `react-data.tsx`, `vue-data.ts`, `web-data.ts`: the same component built from a data definition.
- `react-ssr.tsx`: rendered to a string, then hydrated.
- `vue-ssr.ts`: rendered in Node by the playground's `/__ssr` route, then hydrated, so its markup comes from Node's ICU as a real server's does.

A fixture exports `mount(root)`. When a framework has no fixture, the page sets `data-missing-fixture` and the spec skips itself.

Fixture names follow a pattern:

- `<name>`: the fixture `tests/specs/<name>.spec.ts` runs against.
- `<name>-kitchen-sink`: every variant on one page, for manual testing. Its spec only checks that each variant opens without errors.
- `<name>-render`: parts rendered as other elements, through `render` in React, `as` in Vue and `as-child` on web components.

## Tests

```bash
pnpm --filter tests test
```

Playwright starts the playground for you. In CI it builds the playground and serves the build. See `tests/playwright.config.ts` for the framework and browser projects.
