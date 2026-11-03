"use client"

import * as React from "react"
import { Checkbox, CheckboxGroup, CheckboxIndicator } from "@ui-sdk/react/checkbox"
import { CheckIcon } from "lucide-react"

const toppings = [
  { value: "cheese", label: "Cheese" },
  { value: "mushrooms", label: "Mushrooms" },
  { value: "olives", label: "Olives" },
  { value: "peppers", label: "Peppers" },
]

function Example() {
  const [submitted, setSubmitted] = React.useState<string | null>(null)

  return (
    <div data-slot="stack">
      <h3 id="form-toppings">Toppings</h3>
      <p data-slot="hint">Choose at least one.</p>
      <CheckboxGroup
        aria-labelledby="form-toppings"
        name="toppings"
        form="toppings-form"
        defaultValue={["cheese"]}
        required
      >
        {toppings.map((topping) => (
          <label data-slot="label" key={topping.value}>
            <Checkbox value={topping.value}>
              <CheckboxIndicator>
                <CheckIcon aria-hidden="true" />
              </CheckboxIndicator>
            </Checkbox>
            {topping.label}
          </label>
        ))}
      </CheckboxGroup>
      <form
        data-slot="row"
        id="toppings-form"
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(new FormData(event.currentTarget).getAll("toppings").join(", "))
        }}
        onReset={() => setSubmitted(null)}
      >
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </form>
      <output data-slot="output">{submitted !== null ? `toppings: ${submitted}` : ""}</output>
    </div>
  )
}

export { Example }
