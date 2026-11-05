import { hydrateFixture } from "../../ssr/vue-hydrate"
import SegmentedControlFixture from "./SegmentedControlFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, SegmentedControlFixture)
}

export { SegmentedControlFixture as Fixture, mount }
