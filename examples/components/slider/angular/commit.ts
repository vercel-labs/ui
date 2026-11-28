import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
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
        (valueCommit)="
          log('Saved ' + $event.value + ' (' + $event.reason + ')')
        "
        [defaultValue]="50"
      >
        <div data-slot="row">
          <label uiFieldLabel>Brightness</label>
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
class Example {
  readonly log = useLog()
}

export { Example }
