import { Component, signal } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerAreaThumb,
  ColorPickerInput,
  ColorPickerSlider,
  ColorPickerSliderThumb,
  createColorPickerController,
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
    <div>
      <div data-slot="controls">
        <button type="button" (click)="picker.setValue('#663399')">
          Use Purple
        </button>
      </div>
      <div
        uiColorPicker
        aria-label="Theme color"
        [(value)]="value"
        (valueCommit)="
          log('committed: ' + $event.value + ' (' + $event.reason + ')')
        "
        [controller]="picker"
      >
        <div uiColorPickerArea>
          <div uiColorPickerAreaThumb></div>
        </div>
        <div uiColorPickerSlider channel="hue">
          <div uiColorPickerSliderThumb></div>
        </div>
        <input uiColorPickerInput aria-label="Hex" />
      </div>
    </div>
  `,
})
class Example {
  readonly log = useLog()

  readonly picker = createColorPickerController()

  readonly value = signal("#0ea5e9")
}

export { Example }
