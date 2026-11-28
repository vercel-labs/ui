import { Component } from "@angular/core"
import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerAreaThumb,
  ColorPickerInput,
  ColorPickerSlider,
  ColorPickerSliderThumb,
  ColorPickerSwatch,
} from "@ui-sdk/angular/color-picker"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui-sdk/angular/popover"

@Component({
  imports: [
    ColorPicker,
    ColorPickerArea,
    ColorPickerAreaThumb,
    ColorPickerInput,
    ColorPickerSlider,
    ColorPickerSliderThumb,
    ColorPickerSwatch,
    Popover,
    PopoverContent,
    PopoverTrigger,
  ],
  template: `
    <div uiColorPicker aria-label="Background" defaultValue="#22c55e">
      <ng-container uiPopover>
        <button uiPopoverTrigger aria-label="Background">
          <div uiColorPickerSwatch></div>
        </button>
        <div *uiPopoverContent>
          <div uiColorPickerArea>
            <div uiColorPickerAreaThumb></div>
          </div>
          <div uiColorPickerSlider channel="hue">
            <div uiColorPickerSliderThumb></div>
          </div>
          <input uiColorPickerInput aria-label="Hex" />
        </div>
      </ng-container>
    </div>
  `,
})
class Example {}

export { Example }
