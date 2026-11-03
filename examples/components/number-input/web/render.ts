import "@ui-sdk/web/number-input"
import "@ui-sdk/web/field"
import { createElement, Minus, Plus } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-field>
      <ui-field-label>Temperature</ui-field-label>
      <ui-number-input default-value="-2" min="-20" max="40">
        <ui-number-input-group>
          <ui-number-input-decrement>
            <button aria-label="Colder" title="Colder">
              ${createElement(Minus, { "aria-hidden": "true" }).outerHTML}
            </button>
          </ui-number-input-decrement>
          <ui-number-input-control>
            <input />
          </ui-number-input-control>
          <ui-number-input-increment>
            <button aria-label="Warmer">
              ${createElement(Plus, { "aria-hidden": "true" }).outerHTML}
              <span>Max</span>
            </button>
          </ui-number-input-increment>
        </ui-number-input-group>
      </ui-number-input>
    </ui-field>
  `
  const field = root.querySelector("ui-number-input") as HTMLElement & {
    format: Intl.NumberFormatOptions
    value: number | null
  }
  field.format = { style: "unit", unit: "celsius" }
  const input = root.querySelector("input")!
  const mark = (value: number | null) => input.toggleAttribute("data-negative", value !== null && value < 0)
  field.addEventListener("valuechange", (event) =>
    mark((event as CustomEvent<{ value: number | null }>).detail.value),
  )
  mark(field.value)
}
