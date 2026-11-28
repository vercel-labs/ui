import { Component } from "@angular/core"
import {
  NumberInput,
  NumberInputControl,
  NumberInputIncrement,
} from "@ui-sdk/angular/number-input"
import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from "@ui-sdk/angular/slider"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    NumberInput,
    NumberInputControl,
    NumberInputIncrement,
    Slider,
    SliderControl,
    SliderIndicator,
    SliderThumb,
    SliderTrack,
    SliderValue,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div
        uiSlider
        [defaultValue]="40"
        (valueChange)="action.set('brightness:' + $event)"
      >
        <output uiSliderValue #value="uiSliderValue" class="slider-value"
          >Brightness {{ value.state().text }}</output
        >
        <div uiSliderControl class="slider-control">
          <div uiSliderTrack class="slider-track">
            <div
              uiSliderIndicator
              #indicator="uiSliderIndicator"
              class="slider-indicator"
              [class.is-dragging]="indicator.state().dragging"
              [class.is-idle]="!indicator.state().dragging"
              [style.opacity]="indicator.state().dragging ? 0.5 : 1"
            ></div>
            <span
              uiSliderThumb
              #thumb="uiSliderThumb"
              class="slider-thumb"
              aria-label="Brightness"
            >
              <span class="thumb-label">{{ thumb.state().thumbValue }}</span>
            </span>
          </div>
        </div>
      </div>
      <div uiNumberInput aria-label="Count" [defaultValue]="8" [max]="9">
        <input uiNumberInputControl aria-label="Count" />
        <button
          uiNumberInputIncrement
          #more="uiNumberInputIncrement"
          aria-label="Increase count"
        >
          {{ more.state().disabled ? "At most" : "More" }}
        </button>
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  readonly action = state("")
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
