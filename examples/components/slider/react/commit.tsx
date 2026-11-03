"use client"

import { Field, FieldLabel } from "@ui-sdk/react/field"
import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from "@ui-sdk/react/slider"
import * as React from "react"

const save = () => new Promise((resolve) => setTimeout(resolve, 600))

function Example() {
  const [changes, setChanges] = React.useState(0)
  const [status, setStatus] = React.useState("Drag to change the brightness.")

  return (
    <Field>
      <Slider
        defaultValue={50}
        onValueChange={() => setChanges((count) => count + 1)}
        onValueCommit={async (value, details) => {
          setStatus("Saving…")
          await save()
          setStatus(`Saved ${value} (${details.reason}).`)
        }}
      >
        <div data-slot="row">
          <FieldLabel>Brightness</FieldLabel>
          <SliderValue />
        </div>
        <SliderControl>
          <SliderTrack>
            <SliderIndicator />
            <SliderThumb />
          </SliderTrack>
        </SliderControl>
      </Slider>
      <output data-slot="output">
        <span>Changes: {changes}</span>
        <span>{status}</span>
      </output>
    </Field>
  )
}

export { Example }
