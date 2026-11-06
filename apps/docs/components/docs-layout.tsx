import { MobileNav } from "@/components/mobile-nav"
import { Search } from "@/components/search"
import { Sidebar } from "@/components/sidebar"
import { isFramework } from "@/lib/frameworks"
import type { Section } from "@/lib/sections"
import { frameworkTree, sectionPages, sectionTree } from "@/lib/section-tree"
import { getStarted, source } from "@/lib/source"
import type { Node, Root } from "fumadocs-core/page-tree"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"

// Core's sidebar opens with an overview of the whole site, Get Started and the
// changelog, then Core's own pages under its name.
function withGetStarted(tree: Root): Root {
  const page = source.getPage(getStarted.slugs)
  if (!page) return tree
  const changelog = (node: Node) => node.type === "page" && node.url === "/docs/core/changelog"
  return {
    ...tree,
    name: "",
    children: [
      { type: "separator", name: "Overview" },
      { type: "page", name: page.data.title, url: getStarted.url },
      ...tree.children.filter(changelog),
      { type: "separator", name: tree.name },
      ...tree.children.filter((node) => !changelog(node)),
    ],
  }
}

function DocsLayout({ section, children }: { section: Section; children: ReactNode }) {
  const full = sectionTree(section)
  if (!full) notFound()
  const tree = isFramework(section)
    ? frameworkTree(full, section)
    : section === "core"
      ? withGetStarted(full)
      : full
  const tocs = Object.fromEntries([
    ...source.getPages().flatMap((page) => (page.slugs[0] === section ? [[page.url, page.data.toc]] : [])),
    ...(section === "core" ? [[getStarted.url, source.getPage(getStarted.slugs)?.data.toc]] : []),
  ])
  const pages = sectionPages(section === "core" ? withGetStarted(full) : full)
  const urls = source.getPages().map((page) => page.url)

  return (
    <div className="container flex flex-1 max-lg:px-0">
      {/* Size containment keeps the sidebar from making a short page taller than the window. */}
      <aside className="hidden w-64 shrink-0 contain-size lg:block">
        <div className="sticky top-[calc(var(--banner-height)+4rem)] h-full max-h-[calc(100dvh-4rem-var(--banner-height))]">
          <Sidebar tree={tree} tocs={tocs} />
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <MobileNav section={section} tree={tree} urls={urls} />
        <main className="flex">{children}</main>
      </div>
      <Search section={section} pages={pages} />
    </div>
  )
}

export { DocsLayout }
