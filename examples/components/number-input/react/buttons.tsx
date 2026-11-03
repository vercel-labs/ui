import {
  NumberInput,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
  NumberInputControl,
} from "@ui-sdk/react/number-input"
import { MinusIcon, PlusIcon } from "lucide-react"

export function Example() {
  return (
    <NumberInput defaultValue={1} min={0}>
      <NumberInputGroup>
        <NumberInputDecrement aria-label="Decrease">
          <MinusIcon />
        </NumberInputDecrement>
        <NumberInputControl aria-label="Quantity" />
        <NumberInputIncrement aria-label="Increase">
          <PlusIcon />
        </NumberInputIncrement>
      </NumberInputGroup>
    </NumberInput>
  )
}
