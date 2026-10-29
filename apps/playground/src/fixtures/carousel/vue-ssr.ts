import { hydrateFixture } from "../../ssr/vue-hydrate"
import CarouselFixture from "./CarouselFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, CarouselFixture)
}

export { CarouselFixture as Fixture, mount }
