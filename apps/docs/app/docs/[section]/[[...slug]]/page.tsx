import { DocsPage, docsMetadata } from "@/components/docs-page"
import { isFramework } from "@/lib/frameworks"
import { source } from "@/lib/source"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

export const dynamicParams = false

// Each framework's pages. Core's and Agents' are built once per framework, in
// app/for/[framework], and next.config.mjs serves the reader's.
export default async function Page(
  props: PageProps<"/docs/[section]/[[...slug]]">
) {
  const { section, slug = [] } = await props.params
  if (!isFramework(section)) {
    notFound()
  }
  return <DocsPage section={section} slug={slug} framework={section} />
}

export async function generateStaticParams() {
  return source
    .getPages()
    .filter((page) => isFramework(page.slugs[0]))
    .map((page) => ({ section: page.slugs[0], slug: page.slugs.slice(1) }))
}

export async function generateMetadata(
  props: PageProps<"/docs/[section]/[[...slug]]">
): Promise<Metadata> {
  const { section, slug = [] } = await props.params
  return docsMetadata(section, slug)
}
