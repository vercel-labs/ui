import { isFramework } from "@/lib/frameworks"
import { pageMarkdown } from "@/lib/page-markdown"
import { docPage } from "@/lib/pages"
import { source } from "@/lib/source"
import { notFound } from "next/navigation"

export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return source.getPages().map((page) => ({ slug: page.slugs }))
}

// One page as Markdown, served at its own URL plus `.md`; see `rewrites` in `next.config.mjs`.
export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params
  const page = docPage(slug)
  if (!page) {
    notFound()
  }
  const [section] = slug
  const text = await pageMarkdown(
    page.file,
    isFramework(section) ? section : undefined,
    ({ slugs, hash }) => `/docs/${slugs.join("/")}${hash ? `#${hash}` : ""}`
  )
  return new Response(text, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
