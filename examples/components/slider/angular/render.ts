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
      <div uiSlider [defaultValue]="60">
        <div data-slot="row">
          <label uiFieldLabel>Brightness</label>
          <output uiSliderValue #sliderValue="uiSliderValue"
            >{{ sliderValue.state().text }}%</output
          >
        </div>
        <div uiSliderControl>
          <div uiSliderTrack>
            <div uiSliderIndicator></div>
            <span uiSliderThumb #sliderThumb="uiSliderThumb"
              ><span data-slot="output">{{
                sliderThumb.state().thumbValue
              }}</span></span
            >
          </div>
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
