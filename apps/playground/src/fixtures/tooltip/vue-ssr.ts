import { hydrateFixture } from "../../ssr/vue-hydrate"
import TooltipFixture from "./TooltipFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, TooltipFixture)
}

export { TooltipFixture as Fixture, mount }
