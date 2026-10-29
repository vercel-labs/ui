import { hydrateFixture } from "../../ssr/vue-hydrate"
import ToastFixture from "./ToastFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, ToastFixture)
}

export { ToastFixture as Fixture, mount }
