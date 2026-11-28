import { Component, signal } from "@angular/core"
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
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="value.set([0.3, 0.7])">Reset</button>
      </div>
      <div uiField>
        <div
          uiSlider
          [(value)]="value"
          (beforeValueChange)="
            log([$event.value].flat().join(' – ') + ' (' + $event.reason + ')')
          "
          [min]="0"
          [max]="1"
          [step]="0.1"
        >
          <div data-slot="row">
            <label uiFieldLabel>Temperature</label>
            <output uiSliderValue></output>
          </div>
          <div uiSliderControl>
            <div uiSliderTrack>
              <div uiSliderIndicator></div>
              <div
                uiSliderThumb
                [index]="0"
                aria-label="Minimum temperature"
              ></div>
              <div
                uiSliderThumb
                [index]="1"
                aria-label="Maximum temperature"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
class Example {
  readonly log = useLog()

  readonly value = signal([0.3, 0.7])
}

export { Example }
