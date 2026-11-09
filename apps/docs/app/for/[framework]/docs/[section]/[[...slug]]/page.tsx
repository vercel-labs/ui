import { DocsPage, docsMetadata } from "@/components/docs-page"
import { frameworkIds, isFramework } from "@/lib/frameworks"
import { sharedSections } from "@/lib/sections"
import { source } from "@/lib/source"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

// Core's and Agents' pages, once per framework, so a page shows the reader's
// framework from the first paint. next.config.mjs serves /docs/core/… from here
// by the `framework` cookie, else React.
export default async function Page(
  props: PageProps<"/for/[framework]/docs/[section]/[[...slug]]">
) {
  const { framework, section, slug = [] } = await props.params
  if (!isFramework(framework) || !(section in sharedSections)) {
    notFound()
  }
  return <DocsPage section={section} slug={slug} framework={framework} />
}

export async function generateStaticParams() {
  const pages = source
    .getPages()
    .filter((page) => page.slugs[0] in sharedSections)
  return frameworkIds.flatMap((framework) =>
    pages.map((page) => ({
      framework,
      section: page.slugs[0],
      slug: page.slugs.slice(1),
    }))
  )
}

export async function generateMetadata(
  props: PageProps<"/for/[framework]/docs/[section]/[[...slug]]">
): Promise<Metadata> {
  const { section, slug = [] } = await props.params
  return docsMetadata(section, slug)
}
