import { hydrateFixture } from "../../ssr/vue-hydrate"
import MeterFixture from "./MeterFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, MeterFixture)
}

export { MeterFixture as Fixture, mount }
