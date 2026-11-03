import "@ui-sdk/web/listbox"
import type { UiListboxElement } from "@ui-sdk/web"
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
      <div data-slot="row">
        <button type="button" data-run="selectAll">Select all</button>
        <button type="button" data-run="clear">Clear</button>
        <button type="button" data-run="focus">Focus</button>
      </div>
      <ui-listbox multiple aria-label="Toppings">
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
    </div>
  `
  const listbox = root.querySelector<UiListboxElement>("ui-listbox")!
  for (const button of root.querySelectorAll<HTMLButtonElement>("[data-run]"))
    button.addEventListener("click", () =>
      listbox.api[button.dataset.run as "selectAll" | "clear" | "focus"](),
    )
}

export { mount }
