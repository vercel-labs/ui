import "@ui-sdk/web/select"
import type { ListData } from "@ui-sdk/core/select"
import { Check, ChevronDown, createElement } from "lucide"

const plans: ListData = [
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
  { value: "team", label: "Team" },
  { type: "separator" },
  {
    type: "group",
    label: "Contact sales",
    items: [
      { value: "enterprise", label: "Enterprise" },
      { value: "education", label: "Education", disabled: true },
    ],
  },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-select default-value="pro">
      <div data-slot="stack">
        <ui-select-label>Plan</ui-select-label>
        <ui-select-trigger>
          <button>
            <ui-select-value></ui-select-value>
            ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-select-trigger>
      </div>
      <template>
        <ui-select-content>
          <ui-select-group>
            <ui-select-group-label></ui-select-group-label>
            <ui-select-item>
              <ui-select-item-indicator>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-select-item-indicator>
            </ui-select-item>
          </ui-select-group>
          <ui-select-separator></ui-select-separator>
        </ui-select-content>
      </template>
    </ui-select>
  `
  root.querySelector("ui-select")!.items = plans
}

export { mount }
