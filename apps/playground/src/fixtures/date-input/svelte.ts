import { mount as mountComponent } from "svelte"
import DateInputFixture from "./DateInputFixture.svelte"

function mount(root: HTMLElement) {
  mountComponent(DateInputFixture, { target: root })
}

export { mount }
