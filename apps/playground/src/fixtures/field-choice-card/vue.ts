import { createApp } from "vue"
import FieldChoiceCardFixture from "./FieldChoiceCardFixture.vue"

function mount(root: HTMLElement) {
  createApp(FieldChoiceCardFixture).mount(root)
}

export { mount }
