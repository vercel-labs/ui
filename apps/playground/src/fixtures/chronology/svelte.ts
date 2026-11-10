import { mount as mountComponent } from "svelte"
import ChronologyFixture from "./ChronologyFixture.svelte"

function mount(root: HTMLElement) {
  mountComponent(ChronologyFixture, { target: root })
}

export { mount }
