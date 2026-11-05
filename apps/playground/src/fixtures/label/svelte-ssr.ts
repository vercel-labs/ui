import { hydrateFixture } from "../../svelte-ssr"
import LabelFixture from "./LabelFixture.svelte"

function mount(root: HTMLElement) {
  return hydrateFixture(root, "label", LabelFixture, {})
}

export { mount }
