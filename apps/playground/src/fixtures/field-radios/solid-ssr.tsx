import { hydrateFixture } from "../../ssr/hydrate"
import { Fixture } from "./solid"

function mount(root: HTMLElement) {
  return hydrateFixture(root, "field-radios", () => <Fixture />, {
    manual: true,
  })
}

export { mount }
