import { hydrateFixture } from "../../ssr/vue-hydrate"
import DialogFixture from "./DialogFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, DialogFixture)
}

export { DialogFixture as Fixture, mount }
