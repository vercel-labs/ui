"use client"

import { Slider, SliderControl, SliderIndicator, SliderThumb, SliderTrack } from "@ui-sdk/react/slider"

const thumbs = ["Low", "Medium", "High"]

function Example() {
  return (
    <Slider defaultValue={[10, 20, 70]} step={10}>
      <SliderControl>
        <SliderTrack>
          <SliderIndicator />
          {thumbs.map((label, index) => (
            <SliderThumb key={label} index={index} aria-label={label} />
          ))}
        </SliderTrack>
      </SliderControl>
    </Slider>
  )
}

export { Example }
