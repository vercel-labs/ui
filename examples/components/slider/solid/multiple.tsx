import { Slider, SliderControl, SliderIndicator, SliderThumb, SliderTrack } from "@ui-sdk/solid/slider"
import { For } from "solid-js"

const thumbs = ["Low", "Medium", "High"]

function Example() {
  return (
    <Slider defaultValue={[10, 20, 70]} step={10}>
      <SliderControl>
        <SliderTrack>
          <SliderIndicator />
          <For each={thumbs}>{(label, index) => <SliderThumb index={index()} aria-label={label} />}</For>
        </SliderTrack>
      </SliderControl>
    </Slider>
  )
}

export { Example }
