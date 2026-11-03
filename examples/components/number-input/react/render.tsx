import { Field, FieldLabel } from "@ui-sdk/react/field"
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
    <Field>
      <FieldLabel>Temperature</FieldLabel>
      <NumberInput defaultValue={-2} min={-20} max={40} format={{ style: "unit", unit: "celsius" }}>
        <NumberInputGroup>
          <NumberInputDecrement
            aria-label="Colder"
            render={(props, state) => (
              <button {...props} title={state.atBound ? "As cold as it goes" : "Colder"} />
            )}
          >
            <MinusIcon />
          </NumberInputDecrement>
          <NumberInputControl />
          <NumberInputIncrement aria-label="Warmer">
            {(state) => (state.atBound ? <span>Max</span> : <PlusIcon />)}
          </NumberInputIncrement>
        </NumberInputGroup>
      </NumberInput>
    </Field>
  )
}
