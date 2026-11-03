import { Field, FieldLabel } from "@ui-sdk/solid/field"
import {
  createNumberInputController,
  NumberInput,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
  NumberInputControl,
} from "@ui-sdk/solid/number-input"
import { createSignal } from "solid-js"

export function Example() {
  const zoom = createNumberInputController()
  const [reading, setReading] = createSignal("")

  return (
    <div data-slot="stack">
      <Field>
        <FieldLabel>Zoom</FieldLabel>
        <NumberInput defaultValue={100} min={10} max={400} step={10} controller={zoom}>
          <NumberInputGroup>
            <NumberInputDecrement aria-label="Zoom out">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" x2="16.65" y1="21" y2="16.65" />
                <line x1="8" x2="14" y1="11" y2="11" />
              </svg>
            </NumberInputDecrement>
            <NumberInputControl />
            <NumberInputIncrement aria-label="Zoom in">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" x2="16.65" y1="21" y2="16.65" />
                <line x1="11" x2="11" y1="8" y2="14" />
                <line x1="8" x2="14" y1="11" y2="11" />
              </svg>
            </NumberInputIncrement>
          </NumberInputGroup>
        </NumberInput>
      </Field>
      <div data-slot="row">
        <button type="button" onClick={() => zoom.decrement({ large: true })}>
          −100
        </button>
        <button type="button" onClick={() => zoom.increment()}>
          +10
        </button>
        <button type="button" onClick={() => zoom.setValue(100)}>
          Actual size
        </button>
        <button type="button" onClick={() => setReading(`Zoom is ${zoom.getValue()}.`)}>
          Read
        </button>
        <button type="button" onClick={() => zoom.focus()}>
          Focus
        </button>
      </div>
      <output data-slot="output">{reading()}</output>
    </div>
  )
}
