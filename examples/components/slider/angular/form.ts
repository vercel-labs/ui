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

let nextId = 0

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
      <form [id]="form" data-slot="stack" (submit)="onSubmit($event)">
        <div uiField>
          <div
            uiSlider
            name="price"
            [defaultValue]="[200, 800]"
            [max]="1000"
            [step]="10"
          >
            <div data-slot="row">
              <label uiFieldLabel>Price</label>
              <output uiSliderValue></output>
            </div>
            <div uiSliderControl>
              <div uiSliderTrack>
                <div uiSliderIndicator></div>
                <div uiSliderThumb [index]="0" aria-label="Minimum price"></div>
                <div uiSliderThumb [index]="1" aria-label="Maximum price"></div>
              </div>
            </div>
          </div>
        </div>
        <div uiField>
          <div uiSlider name="rating" [defaultValue]="3" [min]="1" [max]="5">
            <div data-slot="row">
              <label uiFieldLabel>Minimum rating</label>
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
      </form>
      <div uiField>
        <div
          uiSlider
          name="distance"
          [form]="form"
          [defaultValue]="25"
          [max]="100"
          [step]="5"
          [format]="{ style: 'unit', unit: 'kilometer' }"
        >
          <div data-slot="row">
            <label uiFieldLabel>Distance</label>
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
      <div data-slot="row">
        <button type="submit" [attr.form]="form" data-variant="solid">
          Save
        </button>
        <button type="reset" [attr.form]="form">Reset</button>
      </div>
    </div>
  `,
})
class Example {
  readonly log = useLog()

  readonly form = `filters-form-${nextId++}`

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    const data = [...new FormData(event.currentTarget as HTMLFormElement)].map(
      ([name, value]) => `${name}=${value}`
    )
    this.log(`Submitted ${data.join(", ")}`)
  }
}

export { Example }
