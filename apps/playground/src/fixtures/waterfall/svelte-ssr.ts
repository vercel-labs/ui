import { hydrateFixture } from "../../svelte-ssr"
import WaterfallFixture from "./WaterfallFixture.svelte"

function mount(root: HTMLElement) {
  return hydrateFixture(root, "waterfall", WaterfallFixture, {})
}

export { mount }
