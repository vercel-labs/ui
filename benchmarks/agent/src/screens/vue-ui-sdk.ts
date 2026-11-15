import { createApp } from "vue"
import Screen from "./VueUiSdk.vue"

function mount(root: HTMLElement) {
  createApp(Screen).mount(root)
}

export { mount }
