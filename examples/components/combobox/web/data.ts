import type { ListData } from "@ui-sdk/core/combobox"
import "@ui-sdk/web/combobox"
import { Check, ChevronDown, createElement } from "lucide"

const fruits: ListData = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry", keywords: ["red"] },
  { type: "separator" },
  {
    type: "group",
    label: "Citrus",
    items: [
      { value: "lemon", label: "Lemon" },
      { value: "lime", label: "Lime" },
      { value: "orange", label: "Orange", disabled: true },
    ],
  },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-combobox>
      <div data-slot="stack">
        <ui-combobox-label>Fruit</ui-combobox-label>
        <div data-slot="row">
          <ui-combobox-input>
            <input placeholder="Search fruits" />
          </ui-combobox-input>
          <ui-combobox-trigger>
            <button aria-label="Show fruits">${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}</button>
          </ui-combobox-trigger>
        </div>
      </div>
      <template>
        <ui-combobox-content>
          <ui-combobox-list>
            <ui-combobox-group>
              <ui-combobox-group-label></ui-combobox-group-label>
              <ui-combobox-item>
                <ui-combobox-item-indicator>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-combobox-item-indicator>
              </ui-combobox-item>
            </ui-combobox-group>
            <ui-combobox-separator></ui-combobox-separator>
          </ui-combobox-list>
        </ui-combobox-content>
      </template>
    </ui-combobox>
  `
  const combobox = root.querySelector("ui-combobox") as HTMLElement & {
    items: typeof fruits
  }
  combobox.items = fruits
}

export { mount }
