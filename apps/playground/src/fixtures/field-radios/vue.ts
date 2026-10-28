import { createApp } from "vue"
import FieldRadiosFixture from "./FieldRadiosFixture.vue"

function mount(root: HTMLElement) {
  createApp(FieldRadiosFixture).mount(root)
}

export { mount }
