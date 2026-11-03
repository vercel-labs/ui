import { Field, FieldError, FieldLabel } from "@ui-sdk/react/field"
import {
  NumberInput,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
  NumberInputControl,
} from "@ui-sdk/react/number-input"
import { MinusIcon, PlusIcon } from "lucide-react"
import * as React from "react"

export function Example() {
  const [submitted, setSubmitted] = React.useState("")

  return (
    <form
      data-slot="stack"
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(String(new FormData(event.currentTarget).get("age")))
      }}
    >
      <Field>
        <FieldLabel>Age</FieldLabel>
        <NumberInput name="age" required min={18} max={120} onValueChange={() => setSubmitted("")}>
          <NumberInputGroup>
            <NumberInputDecrement aria-label="Decrease">
              <MinusIcon aria-hidden="true" />
            </NumberInputDecrement>
            <NumberInputControl />
            <NumberInputIncrement aria-label="Increase">
              <PlusIcon aria-hidden="true" />
            </NumberInputIncrement>
          </NumberInputGroup>
        </NumberInput>
        <div>
          <FieldError match="valueMissing">Enter your age.</FieldError>
        </div>
      </Field>
      <button type="submit">Continue</button>
      <output data-slot="output">{submitted ? `Submitted: age=${submitted}` : ""}</output>
    </form>
  )
}
