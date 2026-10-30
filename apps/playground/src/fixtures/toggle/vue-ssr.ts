import { hydrateFixture } from "../../ssr/vue-hydrate"
import ToggleFixture from "./ToggleFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, ToggleFixture)
}

export { ToggleFixture as Fixture, mount }
