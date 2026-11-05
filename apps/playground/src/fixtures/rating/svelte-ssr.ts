import { hydrateFixture } from "../../svelte-ssr"
import RatingFixture from "./RatingFixture.svelte"

function mount(root: HTMLElement) {
  return hydrateFixture(root, "rating", RatingFixture, {})
}

export { mount }
