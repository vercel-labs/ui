import { readFileSync } from "node:fs"
import path from "node:path"
import { composition, homeEntry, type ElementDoc } from "./custom-elements"
import { pageMarkdown } from "./page-markdown"
import { docPages, type DocPage } from "./pages"
import { repoRoot } from "./repo-root"

// Every web component in one Markdown file, shipped as `@ui-sdk/web`'s
// docs/components.md. An agent building a page reads it in one go, and opens
// a component's own page only for its examples.

// Text that has a backtick, like a template literal type, takes two.
const code = (text: string) =>
  text.includes("`") ? `\`\` ${text} \`\`` : `\`${text}\``

const camel = (name: string) =>
  name.replace(/-(\w)/g, (_, char: string) => char.toUpperCase())

const sharedAttributes = new Set(["for", "as-child", "debug"])
const sharedProperties = new Set(["api", "controller"])

// A default worth a few characters: a string, a number or `true`, without
// the cases that follow it, like "true, or false when `modal` is false".
const literal = /^(?:"[^"]*"|-?[\d.]+|true)(?=,|$)/

function attribute({
  name,
  type,
  default: fallback,
}: ElementDoc["attributes"][number]) {
  const [value] = fallback?.match(literal) ?? []
  return code(
    `${name}${type && type !== "boolean" ? `: ${type}` : ""}${value ? ` = ${value}` : ""}`
  )
}

// An element's attributes, the properties no attribute holds and its events,
// or nothing for an element that takes none.
function elementLine(doc: ElementDoc) {
  const reflected = new Set(doc.attributes.map(({ name }) => camel(name)))
  const properties = doc.properties.filter(
    ({ name, readonly }) =>
      !readonly && !reflected.has(name) && !sharedProperties.has(name)
  )
  const names = (fields: { name: string }[]) =>
    fields.map(({ name }) => code(name)).join(", ")
  const said = [
    doc.attributes
      .filter(({ name }) => !sharedAttributes.has(name))
      .map(attribute)
      .join(", "),
    properties.length ? `Properties: ${names(properties)}` : "",
    doc.events.length ? `Events: ${names(doc.events)}` : "",
  ].filter(Boolean)
  return said.length ? `- \`<${doc.tagName}>\`: ${said.join(". ")}.` : ""
}

// A page with no composition, like Button's, shows its markup under Usage.
async function usageMarkup(file: string) {
  const markdown = await pageMarkdown(file, "web-components", () => null)
  const [, html] =
    markdown
      .match(/\n## Usage\n([\s\S]*?)(?=\n## )/)?.[1]
      .match(/```html[^\n]*\n([\s\S]*?)\n```/) ?? []
  return (
    html &&
    `\`\`\`html\n${html.replace(/<script\b[\s\S]*?<\/script>\n*/g, "").trim()}\n\`\`\``
  )
}

async function componentSection(page: DocPage, elements: ElementDoc[]) {
  const slug = page.slugs[2]
  const markup =
    (await composition(page.file))?.replace(/^[^\n]*:\n\n(?=```)/, "") ??
    (await usageMarkup(page.file))
  return [
    `### [${page.title}](./components/${slug}.md)`,
    page.description,
    markup,
    elements
      .filter((doc) => homeEntry(doc) === slug)
      .map(elementLine)
      .filter(Boolean)
      .join("\n"),
  ]
    .filter(Boolean)
    .join("\n\n")
}

// The tokens web.css declares on the page, in its first rule. Later rules
// declare a component's own variables.
function tokens() {
  const css = readFileSync(
    path.join(repoRoot, "packages/core/src/web.css"),
    "utf8"
  )
  return [
    ...css.slice(0, css.indexOf("\n  }")).matchAll(/(--ui-[\w-]+):/g),
  ].map(([, name]) => name)
}

/** `@ui-sdk/web`'s docs/components.md, from the elements `describeElements` found. */
async function componentsReference(elements: ElementDoc[]) {
  const pages = docPages("web-components/components").filter(
    (page) => page.slugs.length === 3
  )
  const components = await Promise.all(
    pages.map((page) => componentSection(page, elements))
  )
  return `# ui-sdk web components

> Every component in @ui-sdk/web in one file: how to load them, the rules they share, and each component's composition, attributes and events.

This file is the context an agent needs to build a page with ui-sdk's web components. Each component links to its page, which has its examples, styling hooks and controller. Read a page when you need more than what's here. It's generated from the docs, for this release.

## Load Them

A page with no build step loads \`web.js\` with a module script and links \`web.css\`, both from this package's \`browser\` folder. \`web.js\` defines each component the first time its tags appear, so write the tags and leave out the imports that only define them, like \`import "@ui-sdk/web/popover"\`. \`web.css\` gives every component its default look.

When a page imports a function, like \`toast\` from \`@ui-sdk/web/toast\`, load it from that component's file beside \`web.js\`, like \`browser/web/toast.js\`. \`createParts\` and every behavior in \`@ui-sdk/core\` come from \`browser/web/core.js\`.

## How They Work

- **Parts.** Nest a component's parts as its composition shows. A part finds its root by looking up the DOM, so your own layout elements can sit between them. A part outside its root names it with \`for="id"\`.
- **Native elements.** A \`button\`, \`input\` or \`textarea\` in a composition is your own native element inside the part, like \`<ui-dialog-trigger><button>Open</button></ui-dialog-trigger>\`. Put classes, \`type\` and \`aria-label\` on it. To bind another part to an element of yours, like a menu item to a link, add \`as-child\` and put the element inside.
- **Attributes.** Below, an attribute with no type is a boolean, and \`= value\` is its default. Write a boolean to turn it on. One that's on by default, like \`loop\`, turns off with \`"false"\`. \`disabled\` and \`required\` are on whenever they're written, like on native controls. A list is comma-separated, like \`default-value="bold,italic"\`. The starting state is \`default-value\`, \`default-open\`, \`default-checked\` or \`default-pressed\`.
- **Properties.** Options are properties too, in camel case, and state is live on the element as \`value\`, \`open\`, \`checked\` or \`pressed\`. Setting one fires no event. What an attribute can't hold, like a list's \`items\`, is a property only. Set properties once the element is defined, after \`await customElements.whenDefined("ui-select")\`.
- **Events.** A change fires a lowercase event, like \`openchange\` or \`valuechange\`, on the element whose state changed. Events don't bubble, so listen on that element, or on a container with \`{ capture: true }\`. \`event.detail\` has the \`value\`, the \`reason\`, the \`event\` behind it and its \`source\`, and \`event.preventDefault()\` cancels the change.
- **Popups.** Popovers, menus, selects and dialogs open in the browser's top layer, where you wrote them, with no portal. Place their content with \`side\`, \`align\`, \`side-offset\` and \`align-offset\`. \`dismissible="false"\` on the root keeps Escape and outside presses from closing one. Keep popups outside clickable cards and links.
- **Forms.** Give a control a \`name\` to submit its value. \`required\`, \`disabled\`, \`read-only\` and \`form\` follow native conventions, and \`ui-field\` connects a control to its label, description and error.
- **From code.** A root you can drive from code has an \`api\` property, like \`document.querySelector("ui-dialog").api.open()\`. Its page lists the methods under Controller. \`debug\` on a root logs every change to the console.

## Style Them

\`web.css\` styles each element by its \`data-slot\`, like \`[data-slot="dialog-content"]\`, in a cascade layer named \`ui-sdk\`, so your own styles win over it. State shows as data attributes, like \`data-open\`, \`data-closed\`, \`data-disabled\`, \`data-pressed\` and \`data-side="top"\`. A popup has \`data-starting-style\` while it opens and \`data-ending-style\` while it closes, to transition from.

Change the look with its tokens: ${tokens().map(code).join(", ")}. Each color is a \`light-dark()\` pair, so it follows the page's \`color-scheme\`. A button inside \`<ui-button>\` or a trigger takes \`data-variant="solid"\` or \`data-variant="destructive"\`.

## Components

Each component has its composition, then every element that takes attributes, properties or events. \`for\` on a part, \`as-child\` on a part that doesn't wrap a native element, and \`debug\`, \`api\` and \`controller\` on a root are left out.

${components.join("\n\n")}
`
}

export { componentsReference }
