import { existsSync, readFileSync, readdirSync } from "node:fs"
import path from "node:path"
import { frameworks, type Framework } from "./frameworks"
import { pageMarkdown, type LinkTarget, type PageLinks } from "./page-markdown"
import { docPages, frameworkGuides, type DocPage } from "./pages"
import { utilitiesFolder } from "./sections"
import { exampleFolder } from "./example-folder"

// A framework's docs as one Markdown file for an agent's context, served at
// /docs/<framework>/llms.txt and shipped as each package's docs/llms.txt:
// the framework guides whole, an index of the components that links each
// page, and the utilities. It stays small enough to read in one go, and an
// agent reads only the pages of the components it uses.

/** Each framework's package name, after `@ui-sdk/`. */
const packageNames: Record<Framework, string> = {
  react: "react",
  vue: "vue",
  svelte: "svelte",
  solid: "solid",
  "web-components": "web",
}

// Headings one level deeper for each of `levels`, outside fenced code.
const demote = (text: string, levels: number) =>
  text
    .split(/^( *```[\s\S]*?^ *```)$/m)
    .map((part, index) =>
      index % 2
        ? part
        : part.replace(/^(#{1,6}) /gm, `$1${"#".repeat(levels)} `)
    )
    .join("")

// A page's Markdown without its title, and its description, which come first.
const bodyOf = (markdown: string) =>
  markdown.replace(/^# .*\n\n(?:(?!#|```).*\n\n)?/, "")

// The imports a component's examples write, like `@ui-sdk/react/popover`,
// the most used first.
function importsOf(component: string, framework: Framework) {
  const dir = path.join(exampleFolder(component), frameworks[framework].example)
  if (!existsSync(dir)) {
    return []
  }
  const count = new Map<string, number>()
  const pattern = new RegExp(
    `["'](@ui-sdk/${packageNames[framework]}(?:/[\\w-]+)?)["']`,
    "g"
  )
  for (const file of readdirSync(dir, { withFileTypes: true }).filter((file) =>
    file.isFile()
  )) {
    for (const [, entry] of readFileSync(
      path.join(dir, file.name),
      "utf8"
    ).matchAll(pattern)) {
      if (!entry.endsWith("/agent")) {
        count.set(entry, (count.get(entry) ?? 0) + 1)
      }
    }
  }
  const own = `@ui-sdk/${packageNames[framework]}/${component}`
  return [...count.keys()].sort((a, b) =>
    a === own ? -1 : b === own ? 1 : count.get(b)! - count.get(a)!
  )
}

// A component's line in the index: what it does, where it's imported from,
// and its page.
function componentLine(
  page: DocPage,
  framework: Framework,
  to: (target: LinkTarget) => string
) {
  const slug = page.slugs[2]
  const [entry] = importsOf(slug, framework)
  const from = entry
    ? framework === "web-components"
      ? ` Defined by \`import "${entry}"\`.`
      : ` Import from \`${entry}\`.`
    : ""
  return `- [${page.title}](${to({ slugs: [framework, "components", slug] })}): ${page.description ?? ""}${from}`
}

/**
 * `framework`'s llms.txt. Links go through `link`, like the site's pages or
 * the package's own Markdown copies.
 */
async function frameworkLlms(framework: Framework, link: PageLinks) {
  const { label } = frameworks[framework]
  const name = `@ui-sdk/${packageNames[framework]}`
  const guides = await Promise.all(
    frameworkGuides(framework).map(
      async (page) =>
        `## ${page.title}\n\n${demote(bodyOf(await pageMarkdown(page.file, framework, link)), 1).trim()}`
    )
  )
  const to = (target: LinkTarget) =>
    link(target) ?? `/docs/${target.slugs.join("/")}`

  const components = docPages(`${framework}/components`).filter(
    (entry) => entry.slugs.length === 3
  )
  const utilities = docPages(
    `${framework}/${utilitiesFolder(framework)}`
  ).filter((entry) => entry.slugs.length === 3)
  const utilityPages = await Promise.all(
    utilities.map(
      async (entry) =>
        `### ${entry.title}\n\n${demote(bodyOf(await pageMarkdown(entry.file, framework, link, { compact: true })), 2).trim()}`
    )
  )

  return `# ui-sdk for ${label}

> ${name} renders ui-sdk's framework-free TypeScript core in ${label}. How an interface behaves lives in the core; ${name} turns each primitive into parts. No styles, no dependencies, no providers, no portals.

This file is the context an agent needs to build with ${name}: how ${label} renders a primitive and the conventions every part shares, then every component with a link to its page. Read the pages of the components you use. It's generated from the docs, for this release.

- [Core](${to({ slugs: ["core"] })}): build a component, compose behaviors, and explore the foundations, from defining a primitive to working with state, the browser and text.
- [Agents](${to({ slugs: ["agents"] })}): letting an agent operate a page, and WebMCP.

${guides.join("\n\n")}

## Components

Each page has the component's composition, examples, styling hooks and every prop.

${components.map((page) => componentLine(page, framework, to)).join("\n")}

## ${framework === "react" ? "Hooks" : "Utilities"}

${utilityPages.join("\n\n")}
`
}

export { frameworkLlms, packageNames }
