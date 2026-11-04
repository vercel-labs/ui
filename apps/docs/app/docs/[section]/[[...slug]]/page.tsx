import { PageToc } from "@/components/page-toc"
import { getMDXComponents } from "@/components/mdx"
import { isFramework } from "@/lib/frameworks"
import { isSection, sectionLabel } from "@/lib/sections"
import { source } from "@/lib/source"
import { findNeighbour } from "fumadocs-core/page-tree"
import type { Metadata } from "next"
import Link from "next/link"
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
  const previous = inSection(neighbours.previous?.url) ? neighbours.previous : undefined
  const next = inSection(neighbours.next?.url) ? neighbours.next : undefined

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
    <>
      <div className="min-w-0 flex-1">
        <article className="w-full xl:max-w-2xl px-6 pt-8 pb-24 sm:px-8 lg:px-10">
          <header className="mb-10">
            <h1 className="text-[28px] leading-tight font-medium tracking-[-0.02em] text-balance">
              {page.data.title}
            </h1>
            {page.data.description && (
              <p className="mt-3 text-[15px] leading-relaxed text-pretty text-subtle">
                {page.data.description}
              </p>
            )}
          </header>
          <MDX components={getMDXComponents(isFramework(section) ? section : undefined, resolve)} />
          {(previous || next) && (
            <nav aria-label="Pages" className="mt-20 grid grid-cols-2 gap-4 border-t border-border/70 pt-6">
              {previous ? (
                <Link
                  href={previous.url}
                  className="group flex flex-col gap-1 rounded-md text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
                >
                  <span className="text-[13px] text-subtle">Previous</span>
                  <span className="group-hover:underline group-hover:underline-offset-4">
                    {previous.name}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link
                  href={next.url}
                  className="group flex flex-col items-end gap-1 rounded-md text-end text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
                >
                  <span className="text-[13px] text-subtle">Next</span>
                  <span className="group-hover:underline group-hover:underline-offset-4">{next.name}</span>
                </Link>
              )}
            </nav>
          )}
        </article>
      </div>
      <PageToc toc={page.data.toc} url={page.url} />
    </>
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
