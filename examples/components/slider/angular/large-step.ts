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
        [defaultValue]="100"
        [min]="25"
        [max]="400"
        [largeStep]="25"
        [format]="{ style: 'unit', unit: 'percent' }"
      >
        <div data-slot="row">
          <label uiFieldLabel>Zoom</label>
          <output uiSliderValue></output>
        </div>
        <div uiSliderControl>
          <div uiSliderTrack>
            <div uiSliderIndicator></div>
            <div uiSliderThumb></div>
          </div>
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
