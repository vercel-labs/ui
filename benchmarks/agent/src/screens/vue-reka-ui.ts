import { createApp } from "vue"
import Screen from "./VueRekaUi.vue"

function mount(root: HTMLElement) {
  createApp(Screen).mount(root)
}

export { mount }
