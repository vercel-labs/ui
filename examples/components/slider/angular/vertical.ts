import { Component } from "@angular/core"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
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
  ],
  template: `
    <div data-slot="row">
      @for (channel of channels; track channel.label) {
        <div uiField>
          <div uiSlider orientation="vertical" [defaultValue]="channel.value">
            <div uiSliderControl>
              <div uiSliderTrack>
                <div uiSliderIndicator></div>
                <div uiSliderThumb></div>
              </div>
            </div>
          </div>
          <label uiFieldLabel>{{ channel.label }}</label>
        </div>
      }
    </div>
  `,
})
class Example {
  readonly channels = [
    { label: "Bass", value: 50 },
    { label: "Treble", value: 25 },
  ]
}

export { Example }
