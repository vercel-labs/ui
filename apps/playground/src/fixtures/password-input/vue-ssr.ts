import { hydrateFixture } from "../../ssr/vue-hydrate"
import PasswordInputFixture from "./PasswordInputFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, PasswordInputFixture)
}

export { PasswordInputFixture as Fixture, mount }
