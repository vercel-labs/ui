"use client"

import { Field, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/react/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/react/select"
import * as React from "react"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
]

function Example() {
  const [submitted, setSubmitted] = React.useState("")

  return (
    <form
      data-slot="stack"
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(`Ordered ${new FormData(event.currentTarget).get("fruit")}.`)
      }}
    >
      <Field name="fruit">
        <FieldLabel>Fruit</FieldLabel>
        <Select required placeholder="Select a fruit">
          <SelectTrigger>
            <SelectValue />
            <ChevronDownIcon />
          </SelectTrigger>
          <SelectContent>
            {fruits.map((fruit) => (
              <SelectItem key={fruit.value} value={fruit.value}>
                {fruit.label}
                <SelectItemIndicator>
                  <CheckIcon />
                </SelectItemIndicator>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldDescription>We deliver it tomorrow.</FieldDescription>
        <FieldError match="valueMissing">Pick a fruit to order.</FieldError>
      </Field>
      <button type="submit">Order</button>
      <output data-slot="output">{submitted}</output>
    </form>
  )
}

export { Example }
