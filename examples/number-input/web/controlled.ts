import "@ui-sdk/web/number-input"
import "@ui-sdk/web/field"
import { createElement, Minus, Plus } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-field>
        <ui-field-label>Servings</ui-field-label>
        <ui-number-input default-value="4" min="1" max="12">
          <ui-number-input-group>
            <ui-number-input-decrement>
              <button aria-label="Decrease">
                ${createElement(Minus, { "aria-hidden": "true" }).outerHTML}
              </button>
            </ui-number-input-decrement>
            <ui-number-input-control>
              <input />
            </ui-number-input-control>
            <ui-number-input-increment>
              <button aria-label="Increase">
                ${createElement(Plus, { "aria-hidden": "true" }).outerHTML}
              </button>
            </ui-number-input-increment>
          </ui-number-input-group>
        </ui-number-input>
      </ui-field>
      <div data-slot="row">
        <button type="button" data-value="4">Reset to 4</button>
        <button type="button" data-value="">Clear</button>
      </div>
      <output data-slot="output">
        <span>Value: 4</span>
        <span>Committed: nothing yet</span>
      </output>
    </div>
  `
  const field = root.querySelector("ui-number-input") as HTMLElement & { value: number | null }
  const [shown, committed] = root.querySelectorAll("output span")
  const show = (value: number | null) => (shown.textContent = `Value: ${value ?? "empty"}`)
  field.addEventListener("valuechange", (event) =>
    show((event as CustomEvent<{ value: number | null }>).detail.value),
  )
  field.addEventListener("valuecommit", (event) => {
    const { value, reason } = (event as CustomEvent<{ value: number | null; reason: string }>).detail
    committed.textContent = `Committed: ${value ?? "empty"}, after ${reason}`
  })
  root.querySelectorAll<HTMLButtonElement>("[data-value]").forEach((button) => {
    button.addEventListener("click", () => {
      field.value = button.dataset.value ? Number(button.dataset.value) : null
      show(field.value)
    })
  })
}
