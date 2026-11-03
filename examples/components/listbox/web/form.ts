import "@ui-sdk/web/listbox"
import { Check, createElement } from "lucide"

const toppings = [
  { value: "basil", label: "Basil" },
  { value: "cheese", label: "Extra cheese" },
  { value: "mushroom", label: "Mushroom" },
  { value: "olive", label: "Olive" },
  { value: "onion", label: "Onion" },
  { value: "pepper", label: "Pepper" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <form id="pizza-order-web" data-slot="row">
        <button>Order</button>
        <button type="reset">Reset</button>
      </form>
      <ui-listbox multiple name="toppings" form="pizza-order-web" required default-value="cheese" aria-label="Toppings">
        ${toppings
          .map(
            (topping) => `
              <ui-listbox-item value="${topping.value}">
                ${topping.label}
                <ui-listbox-item-indicator>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-listbox-item-indicator>
              </ui-listbox-item>`,
          )
          .join("")}
      </ui-listbox>
      <output data-slot="output">Submitted: nothing yet</output>
    </div>
  `
  const form = root.querySelector("form")!
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    root.querySelector("output")!.textContent =
      `Submitted: ${new FormData(form).getAll("toppings").join(", ")}`
  })
}

export { mount }
