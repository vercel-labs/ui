import { createApp } from "vue"
import Fixture from "./Fixture.vue"

function mount(root: HTMLElement) {
  createApp(Fixture).mount(root)
}

export { mount }
