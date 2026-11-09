import { hydrateFixture } from "../../ssr/hydrate"
import { Fixture } from "./solid"

// Server renders, then the client hydrates. Every mismatch Solid reports is recorded.
async function mount(root: HTMLElement) {
  await hydrateFixture(root, "navigation-menu", () => <Fixture />)
  // The navigation menu specs read the server's HTML under this name.
  const page = window as unknown as {
    __serverHtml: string
    __serverHTML: string
  }
  page.__serverHTML = page.__serverHtml
}

export { mount }
