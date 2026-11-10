import { mountWhenAsked } from "tests/fixtures/perf.ts"
import { createApp } from "vue"
import Fixture from "./Fixture.vue"

function mount(root: HTMLElement) {
  mountWhenAsked(root, (target) => createApp(Fixture).mount(target))
}

export { mount }
