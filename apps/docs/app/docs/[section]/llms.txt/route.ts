import { isFramework } from "@/lib/frameworks"
import { frameworkLlms } from "@/lib/llms"
import { sectionMarkdown } from "@/lib/section-markdown"
import { isSection, sectionIds } from "@/lib/sections"
import { notFound } from "next/navigation"

export const dynamic = "force-static"

export function generateStaticParams() {
  return sectionIds.map((section) => ({ section }))
}

// A section as one Markdown file for an agent's context. A framework's is
// its guide and every component's reference, Core's and Agents' the whole
// section, which is written for agents.
export async function GET(
  _: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params
  if (!isSection(section)) {
    notFound()
  }
  const text = isFramework(section)
    ? await frameworkLlms(
        section,
        ({ slugs, hash }) => `/docs/${slugs.join("/")}${hash ? `#${hash}` : ""}`
      )
    : await sectionMarkdown(section)
  return new Response(text, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
