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
    <div uiField>
      <div
        uiSlider
        [defaultValue]="[25, 50]"
        [step]="5"
        [format]="{
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0,
        }"
      >
        <div data-slot="row">
          <label uiFieldLabel>Price</label>
          <output uiSliderValue></output>
        </div>
        <div uiSliderControl>
          <div uiSliderTrack>
            <div uiSliderIndicator></div>
            <div uiSliderThumb [index]="0" aria-label="Minimum price"></div>
            <div uiSliderThumb [index]="1" aria-label="Maximum price"></div>
          </div>
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
