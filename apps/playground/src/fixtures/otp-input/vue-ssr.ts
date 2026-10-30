import { hydrateFixture } from "../../ssr/vue-hydrate"
import OTPInputFixture from "./OTPInputFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, OTPInputFixture)
}

export { OTPInputFixture as Fixture, mount }
