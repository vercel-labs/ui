import { hydrateFixture } from "../../ssr/hydrate"
import { Fixture } from "./solid"

// Server renders, then the client hydrates. Every mismatch Solid reports is
// recorded. With ?hydrate=manual, the page stays server markup until
// window.hydrate() runs, so specs can use the fields before hydration.
function mount(root: HTMLElement) {
  return hydrateFixture(root, "number-input", () => <Fixture />, {
    manual: true,
  })
}

export { mount }
