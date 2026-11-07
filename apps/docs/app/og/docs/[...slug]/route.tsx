import { isFramework } from "@/lib/frameworks"
import { renderOgImage } from "@/lib/og-image"
import { sectionLabel } from "@/lib/sections"
import { source } from "@/lib/source"

// The Open Graph image for a docs page: /docs/react/components/menu has
// /og/docs/react/components/menu/image.png.
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const page = source.getPage(slug.slice(0, -1))
  if (!page) return new Response("Not found", { status: 404 })

  const [section] = page.slugs
  const title = isFramework(section) ? `${page.data.title} for ${sectionLabel(section)}` : page.data.title
  return renderOgImage({ title, description: page.data.description })
}

export const dynamicParams = false

export function generateStaticParams() {
  return source.getPages().map((page) => ({ slug: [...page.slugs, "image.png"] }))
}
