import { Component } from "@angular/core"
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
    Slider,
    SliderControl,
    SliderIndicator,
    SliderThumb,
    SliderTrack,
    SliderValue,
  ],
  template: `
    <div dir="rtl" data-slot="stack">
      <div
        uiSlider
        [defaultValue]="[20, 60]"
        locale="ar-EG"
        aria-label="نطاق السعر"
      >
        <div data-slot="row">
          <span data-slot="label">نطاق السعر</span>
          <output uiSliderValue></output>
        </div>
        <div uiSliderControl>
          <div uiSliderTrack>
            <div uiSliderIndicator></div>
            <div uiSliderThumb [index]="0" aria-label="الحد الأدنى"></div>
            <div uiSliderThumb [index]="1" aria-label="الحد الأقصى"></div>
          </div>
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
