import { getStartedMarkdown } from "@/lib/get-started"

export const dynamic = "force-static"

export function GET() {
  return new Response(getStartedMarkdown(), { headers: { "Content-Type": "text/markdown; charset=utf-8" } })
}
