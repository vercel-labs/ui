import { Field, FieldLabel } from "@ui-sdk/react/field"
import {
  createNumberInputController,
  NumberInput,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
  NumberInputControl,
} from "@ui-sdk/react/number-input"
import { ZoomInIcon, ZoomOutIcon } from "lucide-react"
import * as React from "react"

export function Example() {
  const [zoom] = React.useState(createNumberInputController)
  const [reading, setReading] = React.useState("")

  return (
    <div data-slot="stack">
      <Field>
        <FieldLabel>Zoom</FieldLabel>
        <NumberInput defaultValue={100} min={10} max={400} step={10} controller={zoom}>
          <NumberInputGroup>
            <NumberInputDecrement aria-label="Zoom out">
              <ZoomOutIcon aria-hidden="true" />
            </NumberInputDecrement>
            <NumberInputControl />
            <NumberInputIncrement aria-label="Zoom in">
              <ZoomInIcon aria-hidden="true" />
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
      <output data-slot="output">{reading}</output>
    </div>
  )
}
