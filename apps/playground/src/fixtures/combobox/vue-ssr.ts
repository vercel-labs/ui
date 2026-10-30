import { hydrateFixture } from "../../ssr/vue-hydrate"
import ComboboxFixture from "./ComboboxFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, ComboboxFixture)
}

export { ComboboxFixture as Fixture, mount }
