import { hydrateFixture } from "../../ssr/vue-hydrate"
import ToolbarFixture from "./ToolbarFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports
// is recorded, and the server's markup is kept for specs that read it.
async function mount(root: HTMLElement) {
  await hydrateFixture(root, ToolbarFixture)
  const page = window as unknown as { __serverHtml: string; __serverMarkup: string }
  page.__serverMarkup = page.__serverHtml
}

export { ToolbarFixture as Fixture, mount }
