import { hydrateFixture } from "../../ssr/vue-hydrate"
import ListboxFixture from "./ListboxFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, ListboxFixture)
}

export { ListboxFixture as Fixture, mount }
