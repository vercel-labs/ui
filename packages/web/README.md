# @ui-sdk/web

UI SDK as web components: accessible custom elements built from the behaviors in `@ui-sdk/core`. Parts have no styles: each one exposes its state as ARIA and `data-*` attributes and CSS variables, so your CSS or Tailwind decides the look. Popups need no portal and right to left needs no provider.

```bash
npm install @ui-sdk/web @ui-sdk/core
```

Read the docs at [ui-sdk.dev/docs/web-components](https://ui-sdk.dev/docs/web-components).

```ts
import "@ui-sdk/web/popover"
```

Importing a component's entry defines its elements, like `<ui-popover>`, and does nothing on the server. The root entry, `@ui-sdk/web`, has no side effects.

## Docs

The docs ship in this package as Markdown, with custom element markup, generated from the same source as the docs site for the release you installed:

- `docs/README.md` lists every page.
- `docs/components/<name>.md` covers one component: its anatomy, examples, every styling hook (data attributes and CSS variables), the API reference and the keyboard and screen reader behavior its tests check.
- `docs/core.md` is how to build a component ui-sdk doesn't ship, from the same core, in one file.

Hover a component or a prop in your editor for the same descriptions.

## Editors and agents

HTML has no types, so this package describes its elements in a manifest instead: what TypeScript gives the other frameworks' editors and agents.

`custom-elements.json` is a [custom elements manifest](https://github.com/webcomponents/custom-elements-manifest), named by `customElements` in `package.json`. It lists every tag each entry defines, with its attributes, properties, events, parts and styling hooks, generated from the same source as the docs. For completion and hover docs on the tags in HTML files, add the VS Code data to your settings:

```json
{ "html.customData": ["./node_modules/@ui-sdk/web/html-custom-data.json"] }
```
