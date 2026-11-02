import { createApp } from "vue"
import DateInputFixture from "./DateInputFixture.vue"

function mount(root: HTMLElement) {
  createApp(DateInputFixture).mount(root)
}

export { mount }
