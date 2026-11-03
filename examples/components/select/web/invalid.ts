import "@ui-sdk/web/select"
import "@ui-sdk/web/field"
import { Check, ChevronDown, createElement } from "lucide"

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <form data-slot="stack">
      <ui-field name="fruit">
        <ui-field-label>
          Fruit
        </ui-field-label>
        <ui-select name="fruit" required placeholder="Select a fruit">
          <ui-select-trigger>
            <button>
              <ui-select-value></ui-select-value>
              ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
            </button>
          </ui-select-trigger>
          <ui-select-content>
            ${fruits
              .map(
                (fruit) => `
                  <ui-select-item value="${fruit.value}">
                    ${fruit.label}
                    <ui-select-item-indicator>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-select-item-indicator>
                  </ui-select-item>
                `,
              )
              .join("")}
          </ui-select-content>
        </ui-select>
        <ui-field-description>
          We deliver it tomorrow.
        </ui-field-description>
        <ui-field-error match="valueMissing">
          Pick a fruit to order.
        </ui-field-error>
      </ui-field>
      <button type="submit">
        Order
      </button>
      <output data-slot="output"></output>
    </form>
  `
  const form = root.querySelector("form")!
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    root.querySelector("output")!.textContent = `Ordered ${new FormData(form).get("fruit")}.`
  })
}

export { mount }
