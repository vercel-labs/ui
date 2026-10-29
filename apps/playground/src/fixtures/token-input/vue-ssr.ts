import { hydrateFixture } from "../../ssr/vue-hydrate"
import { Fixture } from "./vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, Fixture)
}

export { Fixture, mount }
