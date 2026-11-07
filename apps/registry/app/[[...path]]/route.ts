import { track } from "@vercel/analytics/server"
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

function GET(request: Request) {
  return handle(request)
}

export { GET }
