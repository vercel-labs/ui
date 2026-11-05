import { MobileNav } from "@/components/mobile-nav"
import { Search } from "@/components/search"
import { Sidebar } from "@/components/sidebar"
import { isFramework } from "@/lib/frameworks"
import { isSection } from "@/lib/sections"
import { frameworkTrees, sectionPages, sectionTree } from "@/lib/section-tree"
import { source } from "@/lib/source"
import { notFound } from "next/navigation"

export default async function Layout({ children, params }: LayoutProps<"/docs/[section]">) {
  const { section } = await params
  if (!isSection(section)) notFound()
  const full = sectionTree(section)
  if (!full) notFound()
  const { guides: tree, components: componentsTree } = isFramework(section)
    ? frameworkTrees(full, section)
    : { guides: full, components: undefined }
  const tocs = Object.fromEntries(
    source.getPages().flatMap((page) => (page.slugs[0] === section ? [[page.url, page.data.toc]] : [])),
  )
  const pages = sectionPages(full)
  const urls = source.getPages().map((page) => page.url)
  const nav = { section, tree, componentsTree, tocs, urls }

  return (
    <div className="container flex flex-1 max-lg:px-0">
      <aside className="sticky top-25 hidden h-[calc(100dvh-6.25rem)] w-64 shrink-0 lg:block">
        <Sidebar tree={tree} componentsTree={componentsTree} tocs={tocs} />
      </aside>
      <div className="min-w-0 flex-1">
        <MobileNav {...nav} />
        <main className="flex">{children}</main>
      </div>
      <Search section={section} pages={pages} />
    </div>
  )
}
