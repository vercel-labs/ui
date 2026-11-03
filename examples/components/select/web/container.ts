import "@ui-sdk/web/select"
import { Check, ChevronDown, createElement } from "lucide"

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
]

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-select container="#select-container" default-value="apple">
        <ui-select-trigger>
          <button aria-label="Fruit">
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
      <div data-slot="card">
        Container
        <div id="select-container"></div>
      </div>
    </div>
  `
}
