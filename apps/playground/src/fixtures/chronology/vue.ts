import { createApp } from "vue"
import ChronologyFixture from "./ChronologyFixture.vue"

function mount(root: HTMLElement) {
  createApp(ChronologyFixture).mount(root)
}

export { mount }
