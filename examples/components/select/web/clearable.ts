import "@ui-sdk/web/select"
import { Check, ChevronDown, X, createElement } from "lucide"

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-select default-value="banana" placeholder="Select a fruit">
        <div data-slot="stack">
          <ui-select-label>Fruit</ui-select-label>
          <div data-slot="row">
            <ui-select-trigger>
              <button>
                <ui-select-value></ui-select-value>
                ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
              </button>
            </ui-select-trigger>
            <ui-select-clear>
              <button aria-label="Clear fruit">
                ${createElement(X, { "aria-hidden": "true" }).outerHTML}
              </button>
            </ui-select-clear>
          </div>
        </div>
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
      <output data-slot="output">Value: "banana"</output>
    </div>
  `
  root.querySelector("ui-select")!.addEventListener("valuechange", (event) => {
    const { value } = (event as CustomEvent<{ value: string | null }>).detail
    root.querySelector("output")!.textContent = `Value: ${JSON.stringify(value)}`
  })
}

export { mount }
