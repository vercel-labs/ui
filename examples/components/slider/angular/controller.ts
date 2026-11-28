import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  createSliderController,
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
        <button type="button" (click)="volume.setValue(0)">Mute</button>
        <button type="button" (click)="volume.setValue(volume.getValue() + 10)">
          Louder
        </button>
        <button
          type="button"
          (click)="log(\`Volume is \${volume.getValue()}\`)"
        >
          Read
        </button>
        <button type="button" (click)="volume.focus()">Focus</button>
      </div>
      <div uiField>
        <div
          uiSlider
          [defaultValue]="40"
          [controller]="volume"
          (beforeValueChange)="
            log('Volume ' + $event.value + ' (' + $event.reason + ')')
          "
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
      </div>
    </div>
  `,
})
class Example {
  readonly log = useLog()

  readonly volume = createSliderController<number>()
}

export { Example }
