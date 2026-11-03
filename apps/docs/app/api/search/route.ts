import { frameworkIds, isFramework } from "@/lib/frameworks"
import { source } from "@/lib/source"
import { createFromSource } from "fumadocs-core/search/server"

// Core and Agents pages show in every framework's search.
const server = createFromSource(source, {
  buildIndex(page) {
    const [section] = page.slugs
    return {
      id: page.url,
      url: page.url,
      title: page.data.title ?? page.url,
      description: page.data.description,
      structuredData: page.data.structuredData,
      tag: isFramework(section) ? section : frameworkIds,
    }
  },
})

async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const query = params.get("query")
  if (!query) return Response.json([])
  return Response.json(await server.search(query, { tag: params.get("tag") ?? undefined, limit: 40 }))
}

export { GET }
