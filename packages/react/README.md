# @ui-sdk/react

UI SDK for React: accessible components built from the behaviors in `@ui-sdk/core`. Parts have no styles: each one exposes its state as ARIA and `data-*` attributes and CSS variables, so your CSS or Tailwind decides the look. Popups need no portal and right to left needs no provider.

```bash
npm install @ui-sdk/react @ui-sdk/core
```

Read the docs at [ui-sdk.dev/docs/react](https://ui-sdk.dev/docs/react).

```tsx
import { Popover, PopoverContent, PopoverTrigger } from "@ui-sdk/react/popover"
```

Each component is its own entry, so you pay only for what you import.

## Docs

The docs ship in this package as Markdown, with React code, generated from the same source as the docs site for the release you installed:

- `docs/README.md` lists every page.
- `docs/components/<name>.md` covers one component: its anatomy, examples, every styling hook (data attributes and CSS variables), the API reference and the keyboard and screen reader behavior its tests check.
- `docs/core.md` is how to build a component ui-sdk doesn't ship, from the same core, in one file.

Hover a component or a prop in your editor for the same descriptions.
