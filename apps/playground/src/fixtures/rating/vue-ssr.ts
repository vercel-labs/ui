import { hydrateFixture } from "../../ssr/vue-hydrate"
import RatingFixture from "./RatingFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, RatingFixture)
}

export { RatingFixture as Fixture, mount }
