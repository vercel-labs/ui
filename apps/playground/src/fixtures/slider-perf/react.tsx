import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
} from "@ui-sdk/react/slider"
import { createRoot } from "react-dom/client"
import { countRender, perfSize, perfThumbs } from "tests/fixtures/perf.ts"

// A slider with N thumbs for the counts specs. Every other
// thumb reads its value in its render function, so specs can tell plain
// thumbs' renders from watched ones. The last thumb is a watched one.
const values = perfThumbs(perfSize())

function Fixture() {
  return (
    <div className="fixture">
      <button>Before</button>
      <Slider defaultValue={values} max={1000}>
        <SliderControl className="slider-control is-wide">
          <SliderTrack className="slider-track">
            <SliderIndicator
              className="slider-indicator"
              render={(props) => {
                countRender("indicator")
                return <div {...props} />
              }}
            />
            {values.map((_, index) =>
              index % 2 ? (
                <SliderThumb
                  key={index}
                  index={index}
                  className="slider-thumb"
                  aria-label={`Thumb ${index + 1}`}
                  render={(props, state) => {
                    countRender("watched")
                    return <div {...props} data-value={state.thumbValue} />
                  }}
                />
              ) : (
                <SliderThumb
                  key={index}
                  index={index}
                  className="slider-thumb"
                  aria-label={`Thumb ${index + 1}`}
                  render={(props) => {
                    countRender("plain")
                    return <div {...props} />
                  }}
                />
              )
            )}
          </SliderTrack>
        </SliderControl>
      </Slider>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(<Fixture />)
}

export { mount }
