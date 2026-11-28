import { mountAngular } from "../../angular-mount"
import { Fixture } from "./angular"

// The same autocomplete, rendered from `items`.
function mount(root: HTMLElement) {
  return mountAngular(Fixture, root, { data: true })
}

export { mount }
