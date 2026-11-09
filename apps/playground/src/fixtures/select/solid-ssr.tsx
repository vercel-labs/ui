import { hydrateFixture } from "../../ssr/hydrate"
import { Fixture } from "./solid"

// Server renders, then the client hydrates. Every mismatch Solid reports is recorded.
function mount(root: HTMLElement) {
  // ?data renders the same select from `items`.
  const data = new URLSearchParams(location.search).has("data")
  return hydrateFixture(root, "select", () => <Fixture data={data} />, {
    serverForm: true,
  })
}

export { mount }
