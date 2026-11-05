import { mount as mountComponent } from "svelte"
import ImageCropperFixture from "./ImageCropperFixture.svelte"

function mount(root: HTMLElement) {
  mountComponent(ImageCropperFixture, { target: root })
}

export { mount }
