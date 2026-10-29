import { hydrateFixture } from "../../ssr/vue-hydrate"
import DrawerFixture from "./DrawerFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, DrawerFixture)
}

export { DrawerFixture as Fixture, mount }
