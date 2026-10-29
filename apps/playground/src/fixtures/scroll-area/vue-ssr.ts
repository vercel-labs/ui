import { hydrateFixture } from "../../ssr/vue-hydrate"
import ScrollAreaFixture from "./ScrollAreaFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, ScrollAreaFixture)
}

export { ScrollAreaFixture as Fixture, mount }
