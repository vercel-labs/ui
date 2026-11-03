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
  const [submitted, setSubmitted] = React.useState("")

  return (
    <div data-slot="stack">
      <form
        id="pizza-order"
        data-slot="row"
        onSubmit={(event) => {
          event.preventDefault()
          const data = new FormData(event.currentTarget)
          setSubmitted(data.getAll("toppings").join(", "))
        }}
      >
        <button>Order</button>
        <button type="reset">Reset</button>
      </form>
      <Listbox
        multiple
        name="toppings"
        form="pizza-order"
        required
        defaultValue={["cheese"]}
        aria-label="Toppings"
      >
        {toppings.map((topping) => (
          <ListboxItem key={topping.value} value={topping.value}>
            {topping.label}
            <ListboxItemIndicator>
              <CheckIcon aria-hidden="true" />
            </ListboxItemIndicator>
          </ListboxItem>
        ))}
      </Listbox>
      <output data-slot="output">Submitted: {submitted || "nothing yet"}</output>
    </div>
  )
}

export { Example }
