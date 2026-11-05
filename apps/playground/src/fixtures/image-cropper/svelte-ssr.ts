import { hydrateFixture } from "../../svelte-ssr"
import ImageCropperFixture from "./ImageCropperFixture.svelte"

function mount(root: HTMLElement) {
  return hydrateFixture(root, "image-cropper", ImageCropperFixture, {})
}

export { mount }
