import { mount as mountComponent } from "svelte"
import ColorPickerFixture from "./ColorPickerFixture.svelte"

function mount(root: HTMLElement) {
  mountComponent(ColorPickerFixture, { target: root })
}

export { mount }
