"use client"

import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from "@ui-sdk/react/slider"

function Example() {
  return (
    <Slider defaultValue={100} min={25} max={400} largeStep={25} format={{ style: "unit", unit: "percent" }}>
      <div data-slot="row">
        <span data-slot="label">Zoom</span>
        <SliderValue />
      </div>
      <SliderControl>
        <SliderTrack>
          <SliderIndicator />
          <SliderThumb aria-label="Zoom" />
        </SliderTrack>
      </SliderControl>
      <p data-slot="hint">Focus the thumb and press Page Up to zoom by 25%.</p>
    </Slider>
  )
}

export { Example }
