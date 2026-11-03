import { Field, FieldLabel } from "@ui-sdk/solid/field"
import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from "@ui-sdk/solid/slider"
import { createSignal } from "solid-js"

const save = () => new Promise((resolve) => setTimeout(resolve, 600))

function Example() {
  const [changes, setChanges] = createSignal(0)
  const [status, setStatus] = createSignal("Drag to change the brightness.")

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
        <span>Changes: {changes()}</span>
        <span>{status()}</span>
      </output>
    </Field>
  )
}

export { Example }
