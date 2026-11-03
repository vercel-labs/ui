import { Field, FieldLabel } from "@ui-sdk/solid/field"
import {
  createSliderController,
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from "@ui-sdk/solid/slider"
import { createSignal, Show } from "solid-js"

function Example() {
  const volume = createSliderController<number>()
  const [reading, setReading] = createSignal("")

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
      <Show when={reading()}>
        <output data-slot="output">{reading()}</output>
      </Show>
    </div>
  )
}

export { Example }
