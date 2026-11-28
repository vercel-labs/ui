import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerAreaThumb,
  ColorPickerSlider,
  ColorPickerSliderThumb,
  ColorPickerSwatch,
} from "@ui-sdk/angular/color-picker"
import { Field, FieldLabel } from "@ui-sdk/angular/field"

@Component({
  imports: [
    ColorPicker,
    ColorPickerArea,
    ColorPickerAreaThumb,
    ColorPickerSlider,
    ColorPickerSliderThumb,
    ColorPickerSwatch,
    Field,
    FieldLabel,
  ],
  template: `
    <form data-slot="stack" (submit)="onSubmit($event)">
      <div uiField>
        <label uiFieldLabel>Brand color</label>
        <div uiColorPicker name="brand" defaultValue="#f97316">
          <div uiColorPickerArea>
            <div uiColorPickerAreaThumb></div>
          </div>
          <div data-slot="row">
            <div uiColorPickerSwatch></div>
            <div uiColorPickerSlider channel="hue">
              <div uiColorPickerSliderThumb></div>
            </div>
          </div>
        </div>
      </div>
      <div data-slot="row">
        <button type="submit" data-variant="solid">Save</button>
        <button type="reset">Reset</button>
      </div>
    </form>
  `,
})
class Example {
  readonly log = useLog()

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    this.log(
      `Submitted brand=${new FormData(event.currentTarget as HTMLFormElement).get("brand")}`
    )
  }
}

export { Example }
