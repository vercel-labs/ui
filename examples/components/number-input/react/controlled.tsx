import { Field, FieldLabel } from "@ui-sdk/react/field"
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
  const [value, setValue] = React.useState<number | null>(4)
  const [committed, setCommitted] = React.useState("")

  return (
    <div data-slot="stack">
      <Field>
        <FieldLabel>Servings</FieldLabel>
        <NumberInput
          value={value}
          onValueChange={(next) => setValue(next)}
          onValueCommit={(next, details) => setCommitted(`${next ?? "empty"}, after ${details.reason}`)}
          min={1}
          max={12}
        >
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
      </Field>
      <div data-slot="row">
        <button type="button" onClick={() => setValue(4)}>
          Reset to 4
        </button>
        <button type="button" onClick={() => setValue(null)}>
          Clear
        </button>
      </div>
      <output data-slot="output">
        <span>Value: {value ?? "empty"}</span>
        <span>Committed: {committed || "nothing yet"}</span>
      </output>
    </div>
  )
}
