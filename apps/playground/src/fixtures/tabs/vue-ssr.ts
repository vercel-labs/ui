import { hydrateFixture } from "../../ssr/vue-hydrate"
import TabsFixture from "./TabsFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, TabsFixture)
}

export { TabsFixture as Fixture, mount }
