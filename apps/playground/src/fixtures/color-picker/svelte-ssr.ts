import { hydrateFixture } from "../../svelte-ssr"
import ColorPickerFixture from "./ColorPickerFixture.svelte"

function mount(root: HTMLElement) {
  return hydrateFixture(root, "color-picker", ColorPickerFixture, {})
}

export { mount }
