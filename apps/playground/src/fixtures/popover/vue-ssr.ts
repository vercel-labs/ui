import { hydrateFixture } from "../../ssr/vue-hydrate"
import PopoverFixture from "./PopoverFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, PopoverFixture)
}

export { PopoverFixture as Fixture, mount }
