import { mount as mountComponent } from "svelte"
import SegmentedControlFixture from "./SegmentedControlFixture.svelte"

function mount(root: HTMLElement) {
  mountComponent(SegmentedControlFixture, { target: root })
}

export { mount }
