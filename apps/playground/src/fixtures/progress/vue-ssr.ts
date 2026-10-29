import { hydrateFixture } from "../../ssr/vue-hydrate"
import ProgressFixture from "./ProgressFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, ProgressFixture)
}

export { ProgressFixture as Fixture, mount }
