import { hydrateFixture } from "../../svelte-ssr"
import FieldRadiosFixture from "./FieldRadiosFixture.svelte"

function mount(root: HTMLElement) {
  return hydrateFixture(root, "field-radios", FieldRadiosFixture, {})
}

export { mount }
