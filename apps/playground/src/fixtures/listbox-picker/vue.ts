import { createApp } from "vue"
import ListboxPickerFixture from "./ListboxPickerFixture.vue"

function mount(root: HTMLElement) {
  createApp(ListboxPickerFixture).mount(root)
}

export { mount }
