import type { ListData } from "@ui-sdk/core/listbox"
import "@ui-sdk/web/listbox"
import { Check, createElement } from "lucide"
import type { UiListboxElement } from "@ui-sdk/web"

const plans: ListData<{ id: string; price: number }> = [
  { value: { id: "hobby", price: 0 }, label: "Hobby" },
  { value: { id: "pro", price: 20 }, label: "Pro" },
  { value: { id: "team", price: 50 }, label: "Team" },
  { value: { id: "enterprise", price: 200 }, label: "Enterprise", disabled: true },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-listbox aria-label="Plan">
        <template>
          <ui-listbox-group>
            <ui-listbox-group-label></ui-listbox-group-label>
            <ui-listbox-item>
              <ui-listbox-item-indicator>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-listbox-item-indicator>
            </ui-listbox-item>
          </ui-listbox-group>
          <ui-listbox-separator></ui-listbox-separator>
        </template>
      </ui-listbox>
      <output data-slot="output">pro, $20 a month</output>
    </div>
  `
  const listbox = root.querySelector<UiListboxElement>("ui-listbox")!
  const output = root.querySelector("output")!
  listbox.itemToValue = (plan) => (plan as { id: string }).id
  listbox.isItemEqualToValue = (plan, selected) =>
    (plan as { id: string }).id === (selected as { id: string }).id
  listbox.items = plans
  listbox.value = { id: "pro", price: 20 }
  listbox.addEventListener("valuechange", (event) => {
    const plan = event.detail.value as { id: string; price: number } | null
    output.textContent = plan ? `${plan.id}, $${plan.price} a month` : "No plan"
  })
}

export { mount }
