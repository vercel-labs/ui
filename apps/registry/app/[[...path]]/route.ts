import { track } from "@vercel/analytics/server"
import { createDocsProxy } from "@/lib/docs-proxy"
import { createRegistry } from "@/lib/registry"
import { registryStore } from "@/lib/registry-store"

// The npm registry for the `@ui-sdk` packages, at the root of its own host.
// Anyone can install from it; see REGISTRY.md.
const handle = createRegistry({
  base: "",
  ...registryStore,
  // A Web Analytics custom event, under Events in the project's Analytics tab.
  onDownload: ({ name, version, request }) => track("download", { package: name, version }, { request }),
})

// Public copies of some docs paths while the docs site is protected; see REGISTRY.md.
const proxy = createDocsProxy({
  origin: process.env.DOCS_URL ?? "https://ui.labs.vercel.dev",
  bypass: process.env.DOCS_PROTECTION_BYPASS,
  paths: ["/web.js", "/web/*", "/web@*"],
})

async function GET(request: Request) {
  return (await proxy(request)) ?? handle(request)
}

export { GET }
