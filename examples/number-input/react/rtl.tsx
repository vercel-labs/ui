import { Field, FieldLabel } from "@ui-sdk/react/field"
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
    <div dir="rtl">
      <Field>
        <FieldLabel>الكمية</FieldLabel>
        <NumberInput defaultValue={1} min={0}>
          <NumberInputGroup>
            <NumberInputDecrement aria-label="إنقاص">
              <Minus />
            </NumberInputDecrement>
            <NumberInputControl />
            <NumberInputIncrement aria-label="زيادة">
              <Plus />
            </NumberInputIncrement>
          </NumberInputGroup>
        </NumberInput>
      </Field>
    </div>
  )
}
