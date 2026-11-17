import { mount as mountComponent } from "svelte"
import Fixture from "./Fixture.svelte"

function mount(root: HTMLElement) {
  mountComponent(Fixture, { target: root })
}

export { mount }
