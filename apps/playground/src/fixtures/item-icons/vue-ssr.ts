import { hydrateFixture } from "../../ssr/vue-hydrate"
import ItemIconsFixture from "./ItemIconsFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, ItemIconsFixture)
}

export { ItemIconsFixture as Fixture, mount }
