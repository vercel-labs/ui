import "@ui-sdk/web/select"
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
    <div data-slot="stack">
      <ui-select default-value="blueberry">
        <div data-slot="stack">
          <ui-select-label>Fruit</ui-select-label>
          <ui-select-trigger>
            <button>
              <ui-select-value></ui-select-value>
              ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
            </button>
          </ui-select-trigger>
        </div>
        <ui-select-content align-item-with-trigger>
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
      <label data-slot="label">
        <input type="checkbox" checked />
        Align item with trigger
      </label>
    </div>
  `
  const content = root.querySelector("ui-select-content")!
  const aligned = root.querySelector<HTMLInputElement>('input[type="checkbox"]')!
  aligned.addEventListener("change", () =>
    content.toggleAttribute("align-item-with-trigger", aligned.checked),
  )
}

export { mount }
