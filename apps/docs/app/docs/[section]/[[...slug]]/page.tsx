import { DocsArticle } from "@/components/docs-article"
import { getMDXComponents } from "@/components/mdx"
import { isFramework } from "@/lib/frameworks"
import { isSection, sectionLabel } from "@/lib/sections"
import { source } from "@/lib/source"
import { findNeighbour } from "fumadocs-core/page-tree"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import path from "node:path"

export default async function Page(props: PageProps<"/docs/[section]/[[...slug]]">) {
  const { section, slug = [] } = await props.params
  if (!isSection(section)) notFound()
  const page = source.getPage([section, ...slug])
  if (!page) notFound()

  const MDX = page.data.body
  const neighbours = findNeighbour(source.getPageTree(), page.url)
  const inSection = (url?: string) => url === `/docs/${section}` || url?.startsWith(`/docs/${section}/`)
  const changelog = section === "core" && slug[0] === "changelog"
  const previous = !changelog && inSection(neighbours.previous?.url) ? neighbours.previous : undefined
  const next = !changelog && inSection(neighbours.next?.url) ? neighbours.next : undefined

  const resolve = (href: string) => {
    if (!href.startsWith("./") && !href.startsWith("../")) return href
    const [file, hash] = href.split("#", 2)
    const dir = path.dirname(page.path)
    const found = [`${file}.mdx`, `${file}/index.mdx`, file]
      .map((candidate) => source.getPageByHref(candidate, { dir }))
      .find(Boolean)
    return found ? found.page.url + (hash ? `#${hash}` : "") : href
  }

  return (
    <DocsArticle
      title={page.data.title}
      description={page.data.description}
      date={page.data.date}
      previous={previous}
      next={next}
      toc={page.data.toc}
      url={page.url}
    >
      <MDX components={getMDXComponents(isFramework(section) ? section : undefined, resolve)} />
    </DocsArticle>
  )
}

export async function generateStaticParams() {
  return source.getPages().map((page) => ({ section: page.slugs[0], slug: page.slugs.slice(1) }))
}

export async function generateMetadata(props: PageProps<"/docs/[section]/[[...slug]]">): Promise<Metadata> {
  const { section, slug = [] } = await props.params
  if (!isSection(section)) notFound()
  const page = source.getPage([section, ...slug])
  if (!page) notFound()

  const title = isFramework(section) ? `${page.data.title} for ${sectionLabel(section)}` : page.data.title
  const description = page.data.description
  const image = `/og${page.url}/image.png`
  return {
    title,
    description,
    openGraph: { type: "article", title, description, url: page.url, images: image },
    twitter: { card: "summary_large_image", title, description, images: image },
  }
}
