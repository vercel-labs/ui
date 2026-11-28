import { Component } from "@angular/core"
import { Label } from "@ui-sdk/angular/label"
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
    Label,
    Slider,
    SliderControl,
    SliderIndicator,
    SliderThumb,
    SliderTrack,
    SliderValue,
  ],
  template: `
    <div uiSlider id="volume" [defaultValue]="75">
      <div data-slot="row">
        <label uiLabel for="volume">Volume</label>
        <output uiSliderValue></output>
      </div>
      <div uiSliderControl>
        <div uiSliderTrack>
          <div uiSliderIndicator></div>
          <div uiSliderThumb></div>
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
