import { Component } from "@angular/core"
import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerAreaCanvas,
  ColorPickerAreaThumb,
  ColorPickerInput,
  ColorPickerSlider,
  ColorPickerSliderThumb,
  ColorPickerSwatch,
} from "@ui-sdk/angular/color-picker"

@Component({
  imports: [
    ColorPicker,
    ColorPickerArea,
    ColorPickerAreaCanvas,
    ColorPickerAreaThumb,
    ColorPickerInput,
    ColorPickerSlider,
    ColorPickerSliderThumb,
    ColorPickerSwatch,
  ],
  template: `
    <div
      uiColorPicker
      aria-label="Accent"
      space="oklch"
      defaultValue="oklch(0.62 0.19 259)"
    >
      <div uiColorPickerArea>
        <canvas uiColorPickerAreaCanvas></canvas>
        <div uiColorPickerAreaThumb></div>
      </div>
      <div uiColorPickerSlider channel="hue">
        <div uiColorPickerSliderThumb></div>
      </div>
      <div uiColorPickerSlider channel="alpha">
        <div uiColorPickerSliderThumb></div>
      </div>
      <div data-slot="row">
        <div uiColorPickerSwatch></div>
        <input uiColorPickerInput aria-label="OKLCH" />
      </div>
    </div>
  `,
})
class Example {}

export { Example }
