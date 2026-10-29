import { hydrateFixture } from "../../ssr/vue-hydrate"
import AccordionFixture from "./AccordionFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, AccordionFixture)
}

export { AccordionFixture as Fixture, mount }
