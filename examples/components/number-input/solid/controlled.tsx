import { Field, FieldLabel } from "@ui-sdk/solid/field"
import {
  NumberInput,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
  NumberInputControl,
} from "@ui-sdk/solid/number-input"
import { createSignal } from "solid-js"

export function Example() {
  const [value, setValue] = createSignal<number | null>(4)
  const [committed, setCommitted] = createSignal("")

  return (
    <div data-slot="stack">
      <Field>
        <FieldLabel>Servings</FieldLabel>
        <NumberInput
          value={value()}
          onValueChange={(next) => setValue(next)}
          onValueCommit={(next, details) => setCommitted(`${next ?? "empty"}, after ${details.reason}`)}
          min={1}
          max={12}
        >
          <NumberInputGroup>
            <NumberInputDecrement aria-label="Decrease">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
              </svg>
            </NumberInputDecrement>
            <NumberInputControl />
            <NumberInputIncrement aria-label="Increase">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
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
        <span>Value: {value() ?? "empty"}</span>
        <span>Committed: {committed() || "nothing yet"}</span>
      </output>
    </div>
  )
}
