import { mount as mountComponent } from "svelte"
import ListboxPickerFixture from "./ListboxPickerFixture.svelte"

function mount(root: HTMLElement) {
  mountComponent(ListboxPickerFixture, { target: root })
}

export { mount }
