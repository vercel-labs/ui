import { DocsArticle } from "@/components/docs-article"
import { getMDXComponents } from "@/components/mdx"
import { PageFramework } from "@/components/site-preferences"
import { type Framework, isFramework } from "@/lib/frameworks"
import { isSection } from "@/lib/sections"
import { source } from "@/lib/source"
import { findNeighbour } from "fumadocs-core/page-tree"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import path from "node:path"

function findPage(section: string, slug: string[]) {
  if (!isSection(section)) {
    notFound()
  }
  const page = source.getPage([section, ...slug])
  if (!page) {
    notFound()
  }
  return page
}

/**
 * A docs page. `framework` is the one it's rendered for: a framework's own, or
 * the reader's on Core and Agents, which are built once per framework.
 */
function DocsPage({
  section,
  slug,
  framework,
}: {
  section: string
  slug: string[]
  framework: Framework
}) {
  const page = findPage(section, slug)
  const MDX = page.data.body
  const neighbours = findNeighbour(source.getPageTree(), page.url)
  const inSection = (url?: string) =>
    url === `/docs/${section}` || url?.startsWith(`/docs/${section}/`)
  const changelog = section === "core" && slug[0] === "changelog"
  const previous =
    !changelog && inSection(neighbours.previous?.url)
      ? neighbours.previous
      : undefined
  const next =
    !changelog && inSection(neighbours.next?.url) ? neighbours.next : undefined

  const resolve = (href: string) => {
    if (!href.startsWith("./") && !href.startsWith("../")) {
      return href
    }
    const [file, hash] = href.split("#", 2)
    const dir = path.dirname(page.path)
    const found = [`${file}.mdx`, `${file}/index.mdx`, file]
      .map((candidate) => source.getPageByHref(candidate, { dir }))
      .find(Boolean)
    return found ? found.page.url + (hash ? `#${hash}` : "") : href
  }

  return (
    <PageFramework framework={framework}>
      <DocsArticle
        title={page.data.title}
        description={page.data.description}
        date={page.data.date}
        previous={previous}
        next={next}
        toc={page.data.toc}
        url={page.url}
      >
        <MDX
          components={getMDXComponents(
            isFramework(section) ? section : undefined,
            resolve
          )}
        />
      </DocsArticle>
    </PageFramework>
  )
}

function docsMetadata(section: string, slug: string[]): Metadata {
  const page = findPage(section, slug)
  const title = page.data.title
  const description = page.data.description
  const image = `/og${page.url}/image.png`
  return {
    title,
    description,
    openGraph: {
      type: "article",
      title,
      description,
      url: page.url,
      images: image,
    },
    twitter: { card: "summary_large_image", title, description, images: image },
  }
}

export { DocsPage, docsMetadata }
