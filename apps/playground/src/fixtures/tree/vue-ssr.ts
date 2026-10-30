import { hydrateFixture } from "../../ssr/vue-hydrate"
import TreeFixture from "./TreeFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, TreeFixture)
}

export { TreeFixture as Fixture, mount }
