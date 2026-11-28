import { mountAngular } from "../../angular-mount"
import { Fixture } from "./angular"

// The same tree with its items as data, which give it its whole shape.
function mount(root: HTMLElement) {
  return mountAngular(Fixture, root, { data: true })
}

export { mount }
