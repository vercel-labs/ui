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
      <ui-listbox multiple default-value="cheese,onion" aria-label="Toppings">
        ${toppings
          .map(
            (topping) => `
              <ui-listbox-item value="${topping.value}">
                <ui-listbox-item-indicator keep-mounted>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-listbox-item-indicator>
                ${topping.label}
              </ui-listbox-item>`,
          )
          .join("")}
      </ui-listbox>
      <output data-slot="output">Value: ["cheese","onion"]</output>
    </div>
  `
  const output = root.querySelector("output")!
  root.querySelector("ui-listbox")!.addEventListener("valuechange", (event) => {
    output.textContent = `Value: ${JSON.stringify(event.detail.value)}`
  })
}

export { mount }
