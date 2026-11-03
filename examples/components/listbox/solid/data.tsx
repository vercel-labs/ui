import { Listbox, ListboxItem, ListboxItemIndicator, type ListData } from "@ui-sdk/solid/listbox"
import { createSignal, For } from "solid-js"

const plans = [
  { value: { id: "hobby", price: 0 }, label: "Hobby" },
  { value: { id: "pro", price: 20 }, label: "Pro" },
  { value: { id: "team", price: 50 }, label: "Team" },
  { value: { id: "enterprise", price: 200 }, label: "Enterprise", disabled: true },
] satisfies ListData<{ id: string; price: number }>

function Example() {
  const [value, setValue] = createSignal<{ id: string; price: number } | null>({ id: "pro", price: 20 })

  return (
    <div data-slot="stack">
      <Listbox
        items={plans}
        value={value()}
        onValueChange={setValue}
        itemToValue={(plan) => plan.id}
        isItemEqualToValue={(plan, selected) => plan.id === selected.id}
        aria-label="Plan"
      >
        <For each={plans}>
          {(plan) => (
            <ListboxItem value={plan.value} disabled={plan.disabled}>
              {plan.label}
              <ListboxItemIndicator>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </ListboxItemIndicator>
            </ListboxItem>
          )}
        </For>
      </Listbox>
      <output data-slot="output">{value() ? `${value()!.id}, $${value()!.price} a month` : "No plan"}</output>
    </div>
  )
}

export { Example }
