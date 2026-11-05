import { hydrateFixture } from "../../ssr/vue-hydrate"
import LabelFixture from "./LabelFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, LabelFixture)
}

export { LabelFixture as Fixture, mount }
