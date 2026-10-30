import { hydrateFixture } from "../../ssr/vue-hydrate"
import MenuFixture from "./MenuFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, MenuFixture)
}

export { MenuFixture as Fixture, mount }
