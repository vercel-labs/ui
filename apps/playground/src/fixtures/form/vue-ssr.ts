import { hydrateFixture } from "../../ssr/vue-hydrate"
import FormFixture from "./FormFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, FormFixture)
}

export { FormFixture as Fixture, mount }
