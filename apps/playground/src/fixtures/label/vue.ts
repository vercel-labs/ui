import { createApp } from "vue"
import LabelFixture from "./LabelFixture.vue"

function mount(root: HTMLElement) {
  createApp(LabelFixture).mount(root)
}

export { mount }
