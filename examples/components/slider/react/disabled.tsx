"use client"

import { Slider, SliderControl, SliderIndicator, SliderThumb, SliderTrack } from "@ui-sdk/react/slider"

function Example() {
  return (
    <Slider defaultValue={50} disabled>
      <SliderControl>
        <SliderTrack>
          <SliderIndicator />
          <SliderThumb aria-label="Disabled" />
        </SliderTrack>
      </SliderControl>
    </Slider>
  )
}

export { Example }
