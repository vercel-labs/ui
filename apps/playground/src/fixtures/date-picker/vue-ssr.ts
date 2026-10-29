import { hydrateFixture } from "../../ssr/vue-hydrate"
import DatePickerFixture from "./DatePickerFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, DatePickerFixture)
}

export { DatePickerFixture as Fixture, mount }
