import { mount as mountComponent } from "svelte"
import FieldRadiosFixture from "./FieldRadiosFixture.svelte"

function mount(root: HTMLElement) {
  mountComponent(FieldRadiosFixture, { target: root })
}

export { mount }
