"use client"

import { Field, FieldLabel } from "@ui-sdk/react/field"
import { Slider, SliderControl, SliderIndicator, SliderThumb, SliderTrack } from "@ui-sdk/react/slider"
import * as React from "react"

function Example() {
  const [value, setValue] = React.useState([0.3, 0.7])
  const [reason, setReason] = React.useState("")

  return (
    <Field>
      <div data-slot="row">
        <FieldLabel>Temperature</FieldLabel>
        <span data-slot="output">{value.join(", ")}</span>
      </div>
      <Slider
        value={value}
        onValueChange={(next, details) => {
          setValue(next)
          setReason(details.reason)
        }}
        min={0}
        max={1}
        step={0.1}
      >
        <SliderControl>
          <SliderTrack>
            <SliderIndicator />
            <SliderThumb index={0} aria-label="Minimum temperature" />
            <SliderThumb index={1} aria-label="Maximum temperature" />
          </SliderTrack>
        </SliderControl>
      </Slider>
      <div data-slot="row">
        <button
          type="button"
          onClick={() => {
            setValue([0.3, 0.7])
            setReason("")
          }}
        >
          Reset
        </button>
      </div>
      <output data-slot="output">{reason ? `Last change: ${reason}` : "Drag a thumb."}</output>
    </Field>
  )
}

export { Example }
