"use client"

import { Field, FieldLabel } from "@ui-sdk/react/field"
import {
  createSliderController,
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from "@ui-sdk/react/slider"
import * as React from "react"

function Example() {
  const [volume] = React.useState(() => createSliderController<number>())
  const [reading, setReading] = React.useState("")

  return (
    <div data-slot="stack">
      <Field>
        <Slider defaultValue={40} controller={volume}>
          <div data-slot="row">
            <FieldLabel>Volume</FieldLabel>
            <SliderValue />
          </div>
          <SliderControl>
            <SliderTrack>
              <SliderIndicator />
              <SliderThumb />
            </SliderTrack>
          </SliderControl>
        </Slider>
      </Field>
      <div data-slot="row">
        <button type="button" onClick={() => volume.setValue(0)}>
          Mute
        </button>
        <button type="button" onClick={() => volume.setValue(volume.getValue() + 10)}>
          Louder
        </button>
        <button type="button" onClick={() => setReading(`Volume is ${volume.getValue()}.`)}>
          Read
        </button>
        <button type="button" onClick={() => volume.focus()}>
          Focus
        </button>
      </div>
      {reading && <output data-slot="output">{reading}</output>}
    </div>
  )
}

export { Example }
