import { mount as mountComponent } from "svelte"
import FieldChoiceCardFixture from "./FieldChoiceCardFixture.svelte"

function mount(root: HTMLElement) {
  mountComponent(FieldChoiceCardFixture, { target: root })
}

export { mount }
