import { mount as mountComponent } from "svelte"
import { mountWhenAsked } from "tests/fixtures/perf.ts"
import Fixture from "./Fixture.svelte"

function mount(root: HTMLElement) {
  mountWhenAsked(root, (target) => mountComponent(Fixture, { target }))
}

export { mount }
