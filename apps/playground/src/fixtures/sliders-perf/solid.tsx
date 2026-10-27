import { Slider, SliderControl, SliderIndicator, SliderThumb, SliderTrack } from "@ui-sdk/solid/slider"
import { render } from "@solidjs/web"
import { For } from "solid-js"
import { mountWhenAsked, perfSize } from "tests/fixtures/perf.ts"

// N single-thumb sliders, like a page of settings. Each submits a value, so each renders its form input.
const sliders = Array.from({ length: perfSize(200) }, (_, index) => index)

function Fixture() {
  return (
    <div class="fixture" style={{ "flex-direction": "column", "align-items": "start" }}>
      <button>Before</button>
      <For each={sliders}>
        {(index) => (
          <Slider class="slider-row" name={`slider-${index}`} defaultValue={index % 101}>
            <SliderControl class="slider-control">
              <SliderTrack class="slider-track">
                <SliderIndicator class="slider-indicator" />
                <SliderThumb class="slider-thumb" aria-label={`Slider ${index + 1}`} />
              </SliderTrack>
            </SliderControl>
          </Slider>
        )}
      </For>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  mountWhenAsked(root, (target) => render(() => <Fixture />, target))
}

export { mount }
