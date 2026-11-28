import { hydrateFixture } from "../../ssr/angular-hydrate"
import { Fixture } from "./angular"

// Server renders in Node, then the client hydrates. Every mismatch Angular
// reports is recorded, and the server's markup is kept for specs that read it.
async function mount(root: HTMLElement) {
  await hydrateFixture(root, Fixture)
  const page = window as unknown as {
    __serverHtml: string
    __serverHTML: string
  }
  page.__serverHTML = page.__serverHtml
}

export { Fixture, mount }
