import { Component } from "@angular/core"
import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerAreaThumb,
  ColorPickerInput,
  ColorPickerSlider,
  ColorPickerSliderThumb,
} from "@ui-sdk/angular/color-picker"

@Component({
  imports: [
    ColorPicker,
    ColorPickerArea,
    ColorPickerAreaThumb,
    ColorPickerInput,
    ColorPickerSlider,
    ColorPickerSliderThumb,
  ],
  template: `
    <div uiColorPicker aria-label="Brand color" defaultValue="#0ea5e9" disabled>
      <div uiColorPickerArea>
        <div uiColorPickerAreaThumb></div>
      </div>
      <div uiColorPickerSlider channel="hue">
        <div uiColorPickerSliderThumb></div>
      </div>
      <input uiColorPickerInput aria-label="Hex" />
    </div>
  `,
})
class Example {}

export { Example }
