import { hydrateFixture } from "../../ssr/hydrate"
import { Fixture } from "./solid"

// Server renders, then the client hydrates. Every mismatch Solid reports is
// recorded, and the server's markup is kept for specs that read it.
async function mount(root: HTMLElement) {
  await hydrateFixture(root, "menubar", () => <Fixture />)
  const page = window as unknown as {
    __serverHtml: string
    __serverMarkup: string
  }
  page.__serverMarkup = page.__serverHtml
}

export { mount }
