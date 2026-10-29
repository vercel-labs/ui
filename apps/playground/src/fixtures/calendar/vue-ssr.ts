import { hydrateFixture } from "../../ssr/vue-hydrate"
import CalendarFixture from "./CalendarFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, CalendarFixture)
}

export { CalendarFixture as Fixture, mount }
