import { mount as mountComponent } from "svelte"
import LabelFixture from "./LabelFixture.svelte"

function mount(root: HTMLElement) {
  mountComponent(LabelFixture, { target: root })
}

export { mount }
