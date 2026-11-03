"use client"

import { Listbox, ListboxItem, ListboxItemIndicator, type ListData } from "@ui-sdk/react/listbox"
import { CheckIcon } from "lucide-react"
import * as React from "react"

const plans = [
  { value: { id: "hobby", price: 0 }, label: "Hobby" },
  { value: { id: "pro", price: 20 }, label: "Pro" },
  { value: { id: "team", price: 50 }, label: "Team" },
  { value: { id: "enterprise", price: 200 }, label: "Enterprise", disabled: true },
] satisfies ListData<{ id: string; price: number }>

function Example() {
  const [value, setValue] = React.useState<{ id: string; price: number } | null>({ id: "pro", price: 20 })

  return (
    <div data-slot="stack">
      <Listbox
        items={plans}
        value={value}
        onValueChange={setValue}
        itemToValue={(plan) => plan.id}
        isItemEqualToValue={(plan, selected) => plan.id === selected.id}
        aria-label="Plan"
      >
        {plans.map((plan) => (
          <ListboxItem key={plan.value.id} value={plan.value} disabled={plan.disabled}>
            {plan.label}
            <ListboxItemIndicator>
              <CheckIcon aria-hidden="true" />
            </ListboxItemIndicator>
          </ListboxItem>
        ))}
      </Listbox>
      <output data-slot="output">{value ? `${value.id}, $${value.price} a month` : "No plan"}</output>
    </div>
  )
}

export { Example }
