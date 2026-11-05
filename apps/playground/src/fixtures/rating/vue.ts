import { createApp } from "vue"
import RatingFixture from "./RatingFixture.vue"

function mount(root: HTMLElement) {
  createApp(RatingFixture).mount(root)
}

export { mount }
