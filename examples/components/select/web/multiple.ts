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
      <ui-select multiple default-value="apple, grapes" placeholder="Select fruits">
        <div data-slot="stack">
          <ui-select-label>Fruits</ui-select-label>
          <ui-select-trigger>
            <button>
              <ui-select-value><span></span></ui-select-value>
              ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
            </button>
          </ui-select-trigger>
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
      <output data-slot="output"></output>
    </div>
  `
  const text = root.querySelector("ui-select-value > span")!
  const output = root.querySelector("output")!
  const show = (value: string[]) => {
    const labels = value.map((key) => fruits.find((fruit) => fruit.value === key)?.label ?? key)
    text.textContent =
      labels.length === 0
        ? "Select fruits"
        : labels.length > 2
          ? `${labels[0]} and ${labels.length - 1} more`
          : labels.join(", ")
    output.textContent = `Value: ${JSON.stringify(value)}`
  }
  show(["apple", "grapes"])
  root.querySelector("ui-select")!.addEventListener("valuechange", (event) => {
    show((event as CustomEvent<{ value: string[] }>).detail.value)
  })
}

export { mount }
