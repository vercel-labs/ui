import { DocsArticle } from "@/components/docs-article"
import { DocsLayout } from "@/components/docs-layout"
import { getMDXComponents } from "@/components/mdx"
import { PageFramework } from "@/components/site-preferences"
import { frameworkIds, isFramework } from "@/lib/frameworks"
import { getStarted, source } from "@/lib/source"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

// Get Started, at /docs, once per framework like Core's pages.
export default async function GetStartedPage(props: PageProps<"/for/[framework]/docs">) {
  const { framework } = await props.params
  const page = source.getPage(getStarted.slugs)
  if (!page || !isFramework(framework)) notFound()
  const MDX = page.data.body

  return (
    <DocsLayout section="core">
      <PageFramework framework={framework}>
        <DocsArticle
          title={page.data.title}
          description={page.data.description}
          next={{ name: "Introduction", url: "/docs/core" }}
          toc={page.data.toc}
          url={getStarted.url}
        >
          <MDX components={getMDXComponents()} />
        </DocsArticle>
      </PageFramework>
    </DocsLayout>
  )
}

export function generateStaticParams() {
  return frameworkIds.map((framework) => ({ framework }))
}

export function generateMetadata(): Metadata {
  const page = source.getPage(getStarted.slugs)
  return { title: page?.data.title, description: page?.data.description }
}
