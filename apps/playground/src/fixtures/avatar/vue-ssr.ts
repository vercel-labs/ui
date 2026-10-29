import { hydrateFixture } from "../../ssr/vue-hydrate"
import AvatarFixture from "./AvatarFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, AvatarFixture)
}

export { AvatarFixture as Fixture, mount }
