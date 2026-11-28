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
        [defaultValue]="[540, 1020]"
        [min]="0"
        [max]="1440"
        [step]="15"
        [minStepsBetweenThumbs]="16"
        [format]="time"
      >
        <div data-slot="row">
          <label uiFieldLabel>Opening hours</label>
          <output uiSliderValue></output>
        </div>
        <div uiSliderControl>
          <div uiSliderTrack>
            <div uiSliderIndicator></div>
            <div uiSliderThumb [index]="0" aria-label="Opens"></div>
            <div uiSliderThumb [index]="1" aria-label="Closes"></div>
          </div>
        </div>
      </div>
    </div>
  `,
})
class Example {
  readonly time = (minutes: number) =>
    `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}`
}

export { Example }
