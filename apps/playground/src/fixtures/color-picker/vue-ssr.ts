import { hydrateFixture } from "../../ssr/vue-hydrate"
import ColorPickerFixture from "./ColorPickerFixture.vue"

// Server renders in Node, then the client hydrates. Every mismatch Vue reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, ColorPickerFixture)
}

export { ColorPickerFixture as Fixture, mount }
