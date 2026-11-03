import "@ui-sdk/web/checkbox"
import { Check, createElement } from "lucide"

const toppings = [
  { value: "cheese", label: "Cheese" },
  { value: "mushrooms", label: "Mushrooms" },
  { value: "olives", label: "Olives" },
  { value: "peppers", label: "Peppers" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <h3 id="form-toppings">Toppings</h3>
      <p data-slot="hint">Choose at least one.</p>
      <ui-checkbox-group
        aria-labelledby="form-toppings"
        name="toppings"
        form="toppings-form"
        default-value="cheese"
        required
      >
        ${toppings
          .map(
            (topping) => `
              <label data-slot="label">
                <ui-checkbox value="${topping.value}">
                  <ui-checkbox-indicator>
                    ${createElement(Check, { "aria-hidden": "true" }).outerHTML}
                  </ui-checkbox-indicator>
                </ui-checkbox>
                ${topping.label}
              </label>
            `,
          )
          .join("")}
      </ui-checkbox-group>
      <form data-slot="row" id="toppings-form">
        <button type="submit">
          Submit
        </button>
        <button type="reset">
          Reset
        </button>
      </form>
      <output data-slot="output"></output>
    </div>
  `
  const form = root.querySelector("form")!
  const result = root.querySelector("output")!
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    result.textContent = `toppings: ${new FormData(form).getAll("toppings").join(", ")}`
  })
  form.addEventListener("reset", () => (result.hidden = true))
}

export { mount }
