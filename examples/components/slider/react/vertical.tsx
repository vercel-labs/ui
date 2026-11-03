"use client"

import { Slider, SliderControl, SliderIndicator, SliderThumb, SliderTrack } from "@ui-sdk/react/slider"

const channels = [
  { label: "Bass", value: 50 },
  { label: "Treble", value: 25 },
]

function Example() {
  return (
    <div data-slot="row">
      {channels.map((channel) => (
        <Slider key={channel.label} orientation="vertical" defaultValue={channel.value}>
          <SliderControl>
            <SliderTrack>
              <SliderIndicator />
              <SliderThumb aria-label={channel.label} />
            </SliderTrack>
          </SliderControl>
        </Slider>
      ))}
    </div>
  )
}

export { Example }
