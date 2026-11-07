import { frameworkIds, isFramework, type Framework } from "./frameworks"

// The docs' sections: Core and Agents, which no framework changes, then one per framework.

const sharedSections = {
  core: "Core",
  agents: "Agents",
} as const

type Section = keyof typeof sharedSections | Framework

const sectionIds = [...(Object.keys(sharedSections) as Section[]), ...frameworkIds]

function isSection(value: string): value is Section {
  return value in sharedSections || isFramework(value)
}

/** The folder a framework keeps its utilities in: React's are hooks. */
const utilitiesFolder = (framework: Framework) => (framework === "react" ? "hooks" : "utilities")

/** The equivalent page in another framework, or its introduction when that page is absent. */
function frameworkHref(href: string, framework: Framework, urls: string[]) {
  const [pathname] = href.split(/[?#]/)
  const [, root, section, folder, ...rest] = pathname.split("/")
  if (root !== "docs" || !isFramework(section)) return href
  const same = [
    `/docs/${framework}`,
    folder === utilitiesFolder(section) ? utilitiesFolder(framework) : folder,
    ...rest,
  ]
    .filter(Boolean)
    .join("/")
  return urls.includes(same) ? same + href.slice(pathname.length) : `/docs/${framework}`
}

// Links from the shared sections into a framework's pages say no framework, like
// /docs/components/field, and go to the one the reader last read.
const frameworkPages = [
  "components",
  "utilities",
  "rendering",
  "server-rendering",
  "custom-parts",
  "styling-and-animation",
]

export { frameworkHref, frameworkPages, isSection, type Section, sectionIds, sharedSections, utilitiesFolder }
