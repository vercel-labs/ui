import { Header } from "@/components/docs/header"
import { MobileNav } from "@/components/docs/mobile-nav"
import { RememberFramework } from "@/components/docs/remember-framework"
import { Search } from "@/components/docs/search"
import { Sidebar } from "@/components/docs/sidebar"
import { SiteFooter } from "@/components/docs/site-footer"
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
  // A framework splits into two sidebars; the page's path picks one on the client.
  const { guides: tree, components: componentsTree } = isFramework(section)
    ? frameworkTrees(full, section)
    : { guides: full, components: undefined }
  // Every page's headings, so the sidebar can nest them under the page you're on.
  const tocs = Object.fromEntries(
    source.getPages().flatMap((page) => (page.slugs[0] === section ? [[page.url, page.data.toc]] : [])),
  )
  const pages = sectionPages(full)
  // Every docs page, so switching framework can stay on the same page when the other has it.
  const urls = source.getPages().map((page) => page.url)
  const nav = { section, tree, componentsTree, tocs, urls }

  return (
    <>
      <Header section={section} urls={urls} />
      <div className="mx-auto flex w-full max-w-[1448px]">
        {isFramework(section) && <RememberFramework framework={section} />}
        <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-68 shrink-0 lg:block">
          <Sidebar tree={tree} componentsTree={componentsTree} tocs={tocs} />
        </aside>
        <div className="min-w-0 flex-1">
          <MobileNav {...nav} />
          <main>{children}</main>
        </div>
        <Search section={section} pages={pages} />
      </div>
      <SiteFooter />
    </>
  )
}
