import { Field, FieldDescription, FieldLabel } from "@ui-sdk/react/field"
import {
  NumberInput,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
  NumberInputControl,
} from "@ui-sdk/react/number-input"
import { Minus, Plus } from "lucide-react"

export function Example() {
  return (
    <Field>
      <FieldLabel>Seats included</FieldLabel>
      <NumberInput defaultValue={5} readOnly>
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
      <FieldDescription>Set by your plan.</FieldDescription>
    </Field>
  )
}
