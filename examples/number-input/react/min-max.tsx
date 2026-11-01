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
      <FieldLabel>Guests</FieldLabel>
      <NumberInput defaultValue={2} min={1} max={8}>
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
      <FieldDescription>Between 1 and 8 guests.</FieldDescription>
    </Field>
  )
}
