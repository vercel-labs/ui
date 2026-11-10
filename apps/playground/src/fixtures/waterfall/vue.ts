import { createApp } from "vue"
import WaterfallFixture from "./WaterfallFixture.vue"

function mount(root: HTMLElement) {
  createApp(WaterfallFixture).mount(root)
}

export { mount }
