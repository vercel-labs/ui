import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
} from "@ui-sdk/react/slider"
import { createRoot } from "react-dom/client"
import { mountWhenAsked, perfSize } from "tests/fixtures/perf.ts"

// N single-thumb sliders, like a page of settings. Each submits a value, so each renders its form input.
const sliders = Array.from({ length: perfSize(200) }, (_, index) => index)

function Fixture() {
  return (
    <div
      className="fixture"
      style={{ flexDirection: "column", alignItems: "start" }}
    >
      <button>Before</button>
      {sliders.map((index) => (
        <Slider
          key={index}
          className="slider-row"
          name={`slider-${index}`}
          defaultValue={index % 101}
        >
          <SliderControl className="slider-control">
            <SliderTrack className="slider-track">
              <SliderIndicator className="slider-indicator" />
              <SliderThumb
                className="slider-thumb"
                aria-label={`Slider ${index + 1}`}
              />
            </SliderTrack>
          </SliderControl>
        </Slider>
      ))}
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  mountWhenAsked(root, (target) => createRoot(target).render(<Fixture />))
}

export { mount }
