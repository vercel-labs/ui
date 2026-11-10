import { createApp } from "vue"
import TimelineFixture from "./TimelineFixture.vue"

function mount(root: HTMLElement) {
  createApp(TimelineFixture).mount(root)
}

export { mount }
