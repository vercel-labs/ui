import "@ui-sdk/web/select"
import { Check, ChevronDown, Minus, createElement } from "lucide"

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-select multiple default-value="apple, banana, grapes" placeholder="Select fruits">
      <div data-slot="stack">
        <ui-select-label>Fruits</ui-select-label>
        <ui-select-trigger>
          <button>
            <ui-select-value max="2"></ui-select-value>
            ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-select-trigger>
      </div>
      <ui-select-content>
        <ui-select-select-all>
          Select all
          ${createElement(Check, { "aria-hidden": "true" }).outerHTML}
          ${createElement(Minus, { "aria-hidden": "true" }).outerHTML}
        </ui-select-select-all>
        <ui-select-separator></ui-select-separator>
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
  `
}

export { mount }
