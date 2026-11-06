import { DocsArticle } from "@/components/docs-article"
import { DocsLayout } from "@/components/docs-layout"
import { getMDXComponents } from "@/components/mdx"
import { getStarted, source } from "@/lib/source"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

export default function GetStartedPage() {
  const page = source.getPage(getStarted.slugs)
  if (!page) notFound()
  const MDX = page.data.body

  return (
    <DocsLayout section="core">
      <DocsArticle
        title={page.data.title}
        description={page.data.description}
        next={{ name: "Introduction", url: "/docs/core" }}
        toc={page.data.toc}
        url={getStarted.url}
      >
        <MDX components={getMDXComponents()} />
      </DocsArticle>
    </DocsLayout>
  )
}

export function generateMetadata(): Metadata {
  const page = source.getPage(getStarted.slugs)
  return { title: page?.data.title, description: page?.data.description }
}
