import { mount as mountComponent } from "svelte"
import RatingFixture from "./RatingFixture.svelte"

function mount(root: HTMLElement) {
  mountComponent(RatingFixture, { target: root })
}

export { mount }
