import { sectionMarkdown } from "@/lib/section-markdown"

export const dynamic = "force-static"

// The Behaviors docs as one Markdown file. No framework changes
// them; each framework's Rendering page renders what they define.
export async function GET() {
  return new Response(await sectionMarkdown("behaviors"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
