import { hydrateFixture } from "../../ssr/vue-hydrate"
import CollapsibleFixture from "./CollapsibleFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, CollapsibleFixture)
}

export { CollapsibleFixture as Fixture, mount }
