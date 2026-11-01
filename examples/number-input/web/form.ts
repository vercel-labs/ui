import "@ui-sdk/web/number-input"
import "@ui-sdk/web/field"
import { createElement, Minus, Plus } from "lucide"

let count = 0

export function mount(root: HTMLElement) {
  const formId = `order-${++count}`
  root.innerHTML = `
    <div data-slot="stack">
      <form data-slot="stack" id="${formId}">
        <ui-field>
          <ui-field-label>Quantity</ui-field-label>
          <ui-number-input name="quantity" default-value="2" min="1">
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
        <ui-field>
          <ui-field-label>Tip</ui-field-label>
          <ui-number-input id="tip" name="tip" default-value="1234.5" min="0" step="0.01">
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
          <button type="submit">Save</button>
          <button type="reset">Reset</button>
        </div>
      </form>
      <ui-field>
        <ui-field-label>Gift cards</ui-field-label>
        <ui-number-input name="gift-cards" form="${formId}" default-value="0" min="0">
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
      <output data-slot="output"></output>
    </div>
  `
  const tip = root.querySelector("#tip") as HTMLElement & { format: Intl.NumberFormatOptions }
  tip.format = { style: "currency", currency: "USD" }
  const form = root.querySelector("form")!
  const submitted = root.querySelector("output")!
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    const data = [...new FormData(form)].map(([name, value]) => `${name}=${value}`)
    submitted.textContent = `Submitted: ${data.join(", ")}`
  })
  form.addEventListener("reset", () => (submitted.textContent = ""))
}
