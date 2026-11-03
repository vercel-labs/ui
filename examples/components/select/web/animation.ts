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
    <ui-select default-value="banana">
      <div data-slot="stack">
        <ui-select-label>Fruit</ui-select-label>
        <ui-select-trigger>
          <button>
            <ui-select-value></ui-select-value>
            ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-select-trigger>
        <output data-slot="output">Closed</output>
      </div>
      <ui-select-content>
        ${fruits
          .map(
            (fruit) => `
              <ui-select-item value="${fruit.value}">
                ${fruit.label}
                <ui-select-item-indicator keep-mounted>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-select-item-indicator>
              </ui-select-item>
            `,
          )
          .join("")}
      </ui-select-content>
    </ui-select>
  `
  const select = root.querySelector("ui-select")!
  const status = root.querySelector("output")!
  select.addEventListener("openchange", (event) => {
    status.textContent = (event as CustomEvent<{ value: boolean }>).detail.value ? "Opening…" : "Closing…"
  })
  select.addEventListener("openchangecomplete", (event) => {
    status.textContent = (event as CustomEvent<{ value: boolean }>).detail.value ? "Open" : "Closed"
  })
}
