import { createApp } from "vue"
import ColorPickerFixture from "./ColorPickerFixture.vue"

function mount(root: HTMLElement) {
  createApp(ColorPickerFixture).mount(root)
}

export { mount }
