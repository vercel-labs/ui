import { createApp } from "vue"
import ImageCropperFixture from "./ImageCropperFixture.vue"

function mount(root: HTMLElement) {
  createApp(ImageCropperFixture).mount(root)
}

export { mount }
