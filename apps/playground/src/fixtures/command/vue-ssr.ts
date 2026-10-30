import { hydrateFixture } from "../../ssr/vue-hydrate"
import CommandFixture from "./CommandFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, CommandFixture)
}

export { CommandFixture as Fixture, mount }
