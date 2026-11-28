import { hydrateFixture } from "../../ssr/angular-hydrate"
import { Fixture } from "./angular"

// Server renders in Node, then the client hydrates. Every mismatch Angular reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, Fixture)
}

export { Fixture, mount }
