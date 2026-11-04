import { frameworkIds } from "@/lib/frameworks"
import { source } from "@/lib/source"

export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return frameworkIds.map((framework) => ({ framework }))
}

export async function GET(_request: Request, { params }: RouteContext<"/api/search/[framework]">) {
  const sections = ["behaviors", "agents", (await params).framework]
  const pages = source.getPages().filter((page) => sections.includes(page.slugs[0]))
  return Response.json(
    pages.map((page) => {
      const { headings, contents } = page.data.structuredData
      const description = page.data.description
      return {
        url: page.url,
        title: page.data.title,
        headings,
        contents: [
          ...(description && !contents.some((item) => item.content === description)
            ? [{ content: description }]
            : []),
          // A `<TypeTable>` lands in the structured data as its source.
          ...contents.filter((item) => !item.content.trimStart().startsWith("<")),
        ],
      }
    }),
  )
}
