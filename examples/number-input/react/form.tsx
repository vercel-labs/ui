import { Field, FieldLabel } from "@ui-sdk/react/field"
import {
  NumberInput,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
  NumberInputControl,
} from "@ui-sdk/react/number-input"
import { Minus, Plus } from "lucide-react"
import * as React from "react"

export function Example() {
  const [submitted, setSubmitted] = React.useState("")
  const form = React.useId()

  return (
    <div data-slot="stack">
      <form
        data-slot="stack"
        id={form}
        onSubmit={(event) => {
          event.preventDefault()
          const data = [...new FormData(event.currentTarget)].map(([name, value]) => `${name}=${value}`)
          setSubmitted(data.join(", "))
        }}
        onReset={() => setSubmitted("")}
      >
        <Field>
          <FieldLabel>Quantity</FieldLabel>
          <NumberInput name="quantity" defaultValue={2} min={1}>
            <NumberInputGroup>
              <NumberInputDecrement aria-label="Decrease">
                <Minus aria-hidden="true" />
              </NumberInputDecrement>
              <NumberInputControl />
              <NumberInputIncrement aria-label="Increase">
                <Plus aria-hidden="true" />
              </NumberInputIncrement>
            </NumberInputGroup>
          </NumberInput>
        </Field>
        <Field>
          <FieldLabel>Tip</FieldLabel>
          <NumberInput
            name="tip"
            defaultValue={1234.5}
            min={0}
            step={0.01}
            format={{ style: "currency", currency: "USD" }}
          >
            <NumberInputGroup>
              <NumberInputDecrement aria-label="Decrease">
                <Minus aria-hidden="true" />
              </NumberInputDecrement>
              <NumberInputControl />
              <NumberInputIncrement aria-label="Increase">
                <Plus aria-hidden="true" />
              </NumberInputIncrement>
            </NumberInputGroup>
          </NumberInput>
        </Field>
        <div data-slot="row">
          <button type="submit">Save</button>
          <button type="reset">Reset</button>
        </div>
      </form>
      <Field>
        <FieldLabel>Gift cards</FieldLabel>
        <NumberInput name="gift-cards" form={form} defaultValue={0} min={0}>
          <NumberInputGroup>
            <NumberInputDecrement aria-label="Decrease">
              <Minus aria-hidden="true" />
            </NumberInputDecrement>
            <NumberInputControl />
            <NumberInputIncrement aria-label="Increase">
              <Plus aria-hidden="true" />
            </NumberInputIncrement>
          </NumberInputGroup>
        </NumberInput>
      </Field>
      <output data-slot="output">{submitted ? `Submitted: ${submitted}` : ""}</output>
    </div>
  )
}
