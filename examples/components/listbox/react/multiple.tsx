"use client"

import { Listbox, ListboxItem, ListboxItemIndicator } from "@ui-sdk/react/listbox"
import { CheckIcon } from "lucide-react"
import * as React from "react"

const toppings = [
  { value: "basil", label: "Basil" },
  { value: "cheese", label: "Extra cheese" },
  { value: "mushroom", label: "Mushroom" },
  { value: "olive", label: "Olive" },
  { value: "onion", label: "Onion" },
  { value: "pepper", label: "Pepper" },
]

function Example() {
  const [value, setValue] = React.useState<string[]>(["cheese", "onion"])

  return (
    <div data-slot="stack">
      <Listbox multiple value={value} onValueChange={setValue} aria-label="Toppings">
        {toppings.map((topping) => (
          <ListboxItem key={topping.value} value={topping.value}>
            <ListboxItemIndicator keepMounted>
              <CheckIcon aria-hidden="true" />
            </ListboxItemIndicator>
            {topping.label}
          </ListboxItem>
        ))}
      </Listbox>
      <output data-slot="output">Value: {JSON.stringify(value)}</output>
    </div>
  )
}

export { Example }
