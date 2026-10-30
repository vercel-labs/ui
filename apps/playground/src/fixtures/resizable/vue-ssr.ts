import { hydrateFixture } from "../../ssr/vue-hydrate"
import ResizableFixture from "./ResizableFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, ResizableFixture)
}

export { ResizableFixture as Fixture, mount }
