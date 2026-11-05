import { hydrateFixture } from "../../ssr/hydrate"
import { Fixture } from "./solid"

// Server renders, then the client hydrates. Every mismatch Solid reports is recorded.
function mount(root: HTMLElement) {
  return hydrateFixture(root, "color-picker", () => <Fixture />)
}

export { mount }
