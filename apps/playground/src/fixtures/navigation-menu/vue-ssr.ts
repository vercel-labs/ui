import { hydrateFixture } from "../../ssr/vue-hydrate"
import NavigationMenuFixture from "./NavigationMenuFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports
// is recorded, and the server's markup is kept for specs that read it.
async function mount(root: HTMLElement) {
  await hydrateFixture(root, NavigationMenuFixture)
  const page = window as unknown as { __serverHtml: string; __serverHTML: string }
  page.__serverHTML = page.__serverHtml
}

export { NavigationMenuFixture as Fixture, mount }
