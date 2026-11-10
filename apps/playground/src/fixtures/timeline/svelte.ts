import { mount as mountComponent } from "svelte"
import TimelineFixture from "./TimelineFixture.svelte"

function mount(root: HTMLElement) {
  mountComponent(TimelineFixture, { target: root })
}

export { mount }
