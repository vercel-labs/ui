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
        [defaultValue]="[10, 20, 70]"
        [step]="10"
        [format]="{ style: 'unit', unit: 'percent' }"
      >
        <div data-slot="row">
          <label uiFieldLabel>Alert thresholds</label>
          <output uiSliderValue></output>
        </div>
        <div uiSliderControl>
          <div uiSliderTrack>
            <div uiSliderIndicator></div>
            @for (label of thumbs; track label; let index = $index) {
              <div uiSliderThumb [index]="index" [aria-label]="label"></div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
class Example {
  readonly thumbs = ["Low", "Medium", "High"]
}

export { Example }
