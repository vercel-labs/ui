import { hydrateFixture } from "../../ssr/vue-hydrate"
import ImageCropperFixture from "./ImageCropperFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, ImageCropperFixture)
}

export { ImageCropperFixture as Fixture, mount }
