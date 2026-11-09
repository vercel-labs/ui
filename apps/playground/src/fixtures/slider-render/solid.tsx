import {
  NumberInput,
  NumberInputControl,
  NumberInputIncrement,
} from "@ui-sdk/solid/number-input"
import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from "@ui-sdk/solid/slider"
import { render } from "@solidjs/web"
import { createSignal } from "solid-js"

// Parts rendered as other elements, and from their state. One fixture covers
// Slider and Number Input.
function Fixture() {
  const [action, setAction] = createSignal("")
  return (
    <div class="fixture">
      <button>Before</button>
      <Slider
        defaultValue={40}
        onValueChange={(value) => setAction(`brightness:${value}`)}
      >
        <SliderValue class="slider-value">
          {(state) => `Brightness ${state.text}`}
        </SliderValue>
        <SliderControl class="slider-control">
          <SliderTrack class="slider-track">
            <SliderIndicator
              class={(state) =>
                `slider-indicator ${state.dragging ? "is-dragging" : "is-idle"}`
              }
              style={(state) => ({ opacity: state.dragging ? 0.5 : 1 })}
            />
            <SliderThumb
              class="slider-thumb"
              aria-label="Brightness"
              render={(props) => <span {...props} />}
            >
              {(state) => <span class="thumb-label">{state.thumbValue}</span>}
            </SliderThumb>
          </SliderTrack>
        </SliderControl>
      </Slider>
      <NumberInput defaultValue={8} max={9} aria-label="Count">
        <NumberInputControl aria-label="Count" />
        <NumberInputIncrement aria-label="Increase count">
          {(state) => (state.disabled ? "At most" : "More")}
        </NumberInputIncrement>
      </NumberInput>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
