import "@ui-sdk/web/select"
import { Check, ChevronDown, createElement } from "lucide"

const produce = [
  {
    label: "Fruits",
    items: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
      { value: "orange", label: "Orange" },
    ],
  },
  {
    label: "Vegetables",
    items: [
      { value: "carrot", label: "Carrot" },
      { value: "broccoli", label: "Broccoli" },
      { value: "spinach", label: "Spinach" },
    ],
  },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-select placeholder="Select produce">
      <ui-select-trigger>
        <button aria-label="Produce">
          <ui-select-value></ui-select-value>
          ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
        </button>
      </ui-select-trigger>
      <ui-select-content>
        ${produce
          .map(
            (group, index) => `
              ${index > 0 ? `<ui-select-separator></ui-select-separator>` : ""}
              <ui-select-group>
                <ui-select-group-label>${group.label}</ui-select-group-label>
                ${group.items
                  .map(
                    (item) => `
                      <ui-select-item value="${item.value}">
                        ${item.label}
                        <ui-select-item-indicator>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-select-item-indicator>
                      </ui-select-item>
                    `,
                  )
                  .join("")}
              </ui-select-group>
            `,
          )
          .join("")}
      </ui-select-content>
    </ui-select>
  `
}

export { mount }
