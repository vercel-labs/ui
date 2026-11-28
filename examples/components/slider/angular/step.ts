import { Component } from "@angular/core"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from "@ui-sdk/angular/slider"

@Component({
  imports: [
    Field,
    FieldLabel,
    Slider,
    SliderControl,
    SliderIndicator,
    SliderThumb,
    SliderTrack,
    SliderValue,
  ],
  template: `
    <div data-slot="stack">
      <div uiField>
        <div
          uiSlider
          [defaultValue]="2010"
          [min]="1990"
          [max]="2030"
          [step]="5"
          [format]="{ useGrouping: false }"
        >
          <div data-slot="row">
            <label uiFieldLabel>Year</label>
            <output uiSliderValue></output>
          </div>
          <div uiSliderControl>
            <div uiSliderTrack>
              <div uiSliderIndicator></div>
              <div uiSliderThumb></div>
            </div>
          </div>
          <div data-slot="ticks" aria-hidden="true">
            @for (tick of ticks(9); track $index) {
              <span></span>
            }
          </div>
        </div>
      </div>
      <div uiField>
        <div uiSlider [defaultValue]="0.5" [min]="0" [max]="1" [step]="0.05">
          <div data-slot="row">
            <label uiFieldLabel>Opacity</label>
            <output uiSliderValue></output>
          </div>
          <div uiSliderControl>
            <div uiSliderTrack>
              <div uiSliderIndicator></div>
              <div uiSliderThumb></div>
            </div>
          </div>
          <div data-slot="ticks" aria-hidden="true">
            @for (tick of ticks(21); track $index) {
              <span></span>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
class Example {
  ticks(count: number) {
    return Array.from({ length: count })
  }
}

export { Example }
