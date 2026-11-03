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
      <div data-slot="stack">
        <ui-select-label>Produce</ui-select-label>
        <ui-select-trigger>
          <button>
            <ui-select-value></ui-select-value>
            ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-select-trigger>
      </div>
      <ui-select-content>
        <ui-select-input>
          <input aria-label="Search produce" placeholder="Search…" />
        </ui-select-input>
        <ui-select-empty>Nothing found.</ui-select-empty>
        <ui-select-list>
          ${produce
            .map(
              (group) => `
                <ui-select-group>
                  <ui-select-group-label>${group.label}</ui-select-group-label>
                  ${group.items
                    .map(
                      (item) => `
                        <ui-select-item value="${item.value}" label="${item.label}">
                          <ui-select-item-text>${item.label}</ui-select-item-text>
                          <ui-select-item-indicator>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-select-item-indicator>
                        </ui-select-item>
                      `,
                    )
                    .join("")}
                </ui-select-group>
              `,
            )
            .join("")}
        </ui-select-list>
      </ui-select-content>
    </ui-select>
  `
}

export { mount }
