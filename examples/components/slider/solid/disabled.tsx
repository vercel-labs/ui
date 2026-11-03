import { Slider, SliderControl, SliderIndicator, SliderThumb, SliderTrack } from "@ui-sdk/solid/slider"

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
