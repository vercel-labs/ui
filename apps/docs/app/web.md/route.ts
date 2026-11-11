import { frameworkLlms } from "@/lib/llms"

export const dynamic = "force-static"

// The web components' llms.txt for a page that loads `web.js`, like an
// Artifact. Its links go to each page's Markdown, since an agent reads them.
export async function GET() {
  const text = await frameworkLlms(
    "web-components",
    ({ slugs, hash }) => `/docs/${slugs.join("/")}.md${hash ? `#${hash}` : ""}`,
    { site: "https://ui-sdk.dev" }
  )
  return new Response(text, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
