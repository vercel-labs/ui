import { mount as mountComponent } from "svelte"
import WaterfallFixture from "./WaterfallFixture.svelte"

function mount(root: HTMLElement) {
  mountComponent(WaterfallFixture, { target: root })
}

export { mount }
