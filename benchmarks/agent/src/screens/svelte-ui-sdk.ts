import { mount as mountComponent } from "svelte"
import Screen from "./SvelteUiSdk.svelte"

function mount(root: HTMLElement) {
  mountComponent(Screen, { target: root })
}

export { mount }
