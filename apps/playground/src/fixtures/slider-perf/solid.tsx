import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
} from "@ui-sdk/solid/slider"
import { render } from "@solidjs/web"
import { For, untrack } from "solid-js"
import { countRender, perfSize, perfThumbs } from "tests/fixtures/perf.ts"

// A slider with N thumbs for the counts specs. Every other
// thumb reads its value in its render function, so specs can tell plain
// thumbs' renders from watched ones. The last thumb is a watched one.
const values = perfThumbs(perfSize())

function Fixture() {
  return (
    <div class="fixture">
      <button>Before</button>
      <Slider defaultValue={values} max={1000}>
        <SliderControl class="slider-control is-wide">
          <SliderTrack class="slider-track">
            <SliderIndicator
              class="slider-indicator"
              render={(props) => {
                countRender("indicator")
                return <div {...props} />
              }}
            />
            <For each={values}>
              {(_, index) =>
                // The list never reorders, so a row reads its place once.
                untrack(index) % 2 ? (
                  <SliderThumb
                    index={index()}
                    class="slider-thumb"
                    aria-label={`Thumb ${index() + 1}`}
                    render={(props, state) => {
                      countRender("watched")
                      return <div {...props} data-value={state.thumbValue} />
                    }}
                  />
                ) : (
                  <SliderThumb
                    index={index()}
                    class="slider-thumb"
                    aria-label={`Thumb ${index() + 1}`}
                    render={(props) => {
                      countRender("plain")
                      return <div {...props} />
                    }}
                  />
                )
              }
            </For>
          </SliderTrack>
        </SliderControl>
      </Slider>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { mount }
