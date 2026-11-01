import "@ui-sdk/web/number-input"
import "@ui-sdk/web/field"
import { createElement, Minus, Plus } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <form data-slot="stack">
      <ui-field>
        <ui-field-label>Age</ui-field-label>
        <ui-number-input name="age" required min="18" max="120">
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
        <div><ui-field-error match="valueMissing">Enter your age.</ui-field-error></div>
      </ui-field>
      <button type="submit">Continue</button>
      <output data-slot="output"></output>
    </form>
  `
  const form = root.querySelector("form")!
  const output = root.querySelector("output")!
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    output.textContent = `Submitted: age=${new FormData(form).get("age")}`
  })
  root.querySelector("ui-number-input")!.addEventListener("valuechange", () => (output.textContent = ""))
}
