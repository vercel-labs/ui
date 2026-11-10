import { hydrateFixture } from "../../ssr/hydrate"
import { Fixture } from "./solid"

// Server renders, then the client hydrates. Every mismatch Solid reports is
// recorded, and the server's markup is kept for specs that read it, under the
// name the chronology specs use.
function mount(root: HTMLElement) {
  const page = window as unknown as { __serverHtml?: string }
  Object.defineProperty(window, "__serverMarkup", {
    get: () => page.__serverHtml,
  })
  return hydrateFixture(root, "chronology", () => <Fixture />)
}

export { mount }
