import { hydrateFixture } from "../../svelte-ssr"
import DateInputFixture from "./DateInputFixture.svelte"

function mount(root: HTMLElement) {
  return hydrateFixture(root, "date-input", DateInputFixture, {})
}

export { mount }
