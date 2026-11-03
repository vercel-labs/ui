import { Slider, SliderControl, SliderIndicator, SliderThumb, SliderTrack } from "@ui-sdk/solid/slider"
import { For } from "solid-js"

const channels = [
  { label: "Bass", value: 50 },
  { label: "Treble", value: 25 },
]

function Example() {
  return (
    <div data-slot="row">
      <For each={channels}>
        {(channel) => (
          <Slider orientation="vertical" defaultValue={channel.value}>
            <SliderControl>
              <SliderTrack>
                <SliderIndicator />
                <SliderThumb aria-label={channel.label} />
              </SliderTrack>
            </SliderControl>
          </Slider>
        )}
      </For>
    </div>
  )
}

export { Example }
