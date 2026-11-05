import { createApp } from "vue"
import SegmentedControlFixture from "./SegmentedControlFixture.vue"

function mount(root: HTMLElement) {
  createApp(SegmentedControlFixture).mount(root)
}

export { mount }
