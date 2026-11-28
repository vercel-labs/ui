import { Component } from "@angular/core"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/angular/field"
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
    FieldDescription,
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
        [defaultValue]="0.3"
        [format]="{ style: 'percent' }"
        [min]="0"
        [max]="1"
        [step]="0.01"
      >
        <div data-slot="row">
          <label uiFieldLabel>Volume</label>
          <output uiSliderValue></output>
        </div>
        <div uiSliderControl>
          <div uiSliderTrack>
            <div uiSliderIndicator></div>
            <div uiSliderThumb></div>
          </div>
        </div>
      </div>
      <p uiFieldDescription>How loud notifications play.</p>
    </div>
  `,
})
class Example {}

export { Example }
