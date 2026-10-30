import { hydrateFixture } from "../../ssr/vue-hydrate"
import PaginationFixture from "./PaginationFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, PaginationFixture)
}

export { PaginationFixture as Fixture, mount }
