import { hydrateFixture } from "../../ssr/vue-hydrate"
import SelectFixture from "./SelectFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, SelectFixture)
}

export { SelectFixture as Fixture, mount }
