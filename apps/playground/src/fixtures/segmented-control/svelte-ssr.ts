import { hydrateFixture } from "../../svelte-ssr"
import SegmentedControlFixture from "./SegmentedControlFixture.svelte"

function mount(root: HTMLElement) {
  return hydrateFixture(root, "segmented-control", SegmentedControlFixture, {})
}

export { mount }
