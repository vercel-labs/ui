import { hydrateFixture } from "../../ssr/vue-hydrate"
import SliderFixture from "./SliderFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, SliderFixture)
}

export { SliderFixture as Fixture, mount }
