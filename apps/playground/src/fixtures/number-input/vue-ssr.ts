import { hydrateFixture } from "../../ssr/vue-hydrate"
import NumberInputFixture from "./NumberInputFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, NumberInputFixture)
}

export { NumberInputFixture as Fixture, mount }
