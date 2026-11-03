import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from "@ui-sdk/solid/slider"

function Example() {
  return (
    <Slider defaultValue={60} aria-label="Brightness">
      <SliderValue>{(state) => `Brightness ${state.text}%`}</SliderValue>
      <SliderControl>
        <SliderTrack>
          <SliderIndicator />
          <SliderThumb aria-label="Brightness" render={(props) => <span {...props} />}>
            {(state) => <span data-slot="output">{state.thumbValue}</span>}
          </SliderThumb>
        </SliderTrack>
      </SliderControl>
    </Slider>
  )
}

export { Example }
