import "@ui-sdk/web/select"
import { Check, ChevronDown, createElement } from "lucide"

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
]

const variants = [
  { label: "Disabled", attributes: 'default-value="banana" disabled' },
  { label: "Read-only", attributes: 'default-value="banana" read-only' },
  { label: "Disabled item", attributes: "" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      ${variants
        .map(
          (variant) => `
            <ui-select ${variant.attributes} placeholder="Select a fruit">
              <div data-slot="stack">
                <ui-select-label>${variant.label}</ui-select-label>
                <ui-select-trigger>
                  <button>
                    <ui-select-value></ui-select-value>
                    ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
                  </button>
                </ui-select-trigger>
              </div>
              <ui-select-content>
                ${fruits
                  .map(
                    (fruit) => `
                      <ui-select-item value="${fruit.value}" ${fruit.value === "grapes" ? "disabled" : ""}>
                        ${fruit.label}
                        <ui-select-item-indicator>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-select-item-indicator>
                      </ui-select-item>
                    `,
                  )
                  .join("")}
              </ui-select-content>
            </ui-select>
          `,
        )
        .join("")}
    </div>
  `
}

export { mount }
