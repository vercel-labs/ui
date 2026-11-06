import { MobileNav } from "@/components/mobile-nav"
import { Search } from "@/components/search"
import { Sidebar } from "@/components/sidebar"
import { getStarted } from "@/lib/get-started"
import { isFramework } from "@/lib/frameworks"
import type { Section } from "@/lib/sections"
import { frameworkTrees, sectionPages, sectionTree } from "@/lib/section-tree"
import { source } from "@/lib/source"
import type { Root } from "fumadocs-core/page-tree"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"

// Core's sidebar opens with Get Started, which lives at /docs outside every section.
function withGetStarted(tree: Root): Root {
  return { ...tree, children: [{ type: "page", name: getStarted.title, url: "/docs" }, ...tree.children] }
}

function DocsLayout({ section, children }: { section: Section; children: ReactNode }) {
  const full = sectionTree(section)
  if (!full) notFound()
  const { guides, components: componentsTree } = isFramework(section)
    ? frameworkTrees(full, section)
    : { guides: full, components: undefined }
  const tree = section === "core" ? withGetStarted(guides) : guides
  const tocs = Object.fromEntries([
    ...source.getPages().flatMap((page) => (page.slugs[0] === section ? [[page.url, page.data.toc]] : [])),
    ...(section === "core" ? [["/docs", getStarted.toc]] : []),
  ])
  const pages = sectionPages(section === "core" ? withGetStarted(full) : full)
  const urls = source.getPages().map((page) => page.url)

  return (
    <div className="container flex flex-1 max-lg:px-0">
      {/* Size containment keeps the sidebar from making a short page taller than the window. */}
      <aside className="hidden w-64 shrink-0 contain-size lg:block">
        <div className="sticky top-25 h-full max-h-[calc(100dvh-6.25rem)]">
          <Sidebar tree={tree} componentsTree={componentsTree} tocs={tocs} />
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <MobileNav section={section} tree={tree} componentsTree={componentsTree} urls={urls} />
        <main className="flex">{children}</main>
      </div>
      <Search section={section} pages={pages} />
    </div>
  )
}

export { DocsLayout }
