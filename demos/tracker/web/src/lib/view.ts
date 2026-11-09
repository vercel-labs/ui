import { render, type TemplateResult } from "lit-html"
import { subscribe as onRoute } from "./router"
import { subscribe as onStore } from "./tracker"

let draw = () => {}

function mount(view: () => TemplateResult, root: HTMLElement) {
  draw = () => render(view(), root)
  onRoute(redraw)
  onStore(redraw)
  draw()
}

function redraw() {
  draw()
}

function same(a: unknown, b: unknown) {
  if (Array.isArray(a) && Array.isArray(b)) {
    return (
      a.length === b.length &&
      a.every((value, index) => Object.is(value, b[index]))
    )
  }
  return Object.is(a, b)
}

function onChange<Value>(
  current: () => Value,
  handler: (value: Value) => void
) {
  return (event: CustomEvent<{ value: unknown }>) => {
    const value = event.detail.value as Value
    if (!same(value, current())) {
      handler(value)
    }
  }
}

export { mount, onChange, redraw }
