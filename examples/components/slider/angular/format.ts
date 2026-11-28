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
    <div data-slot="stack">
      @for (slider of sliders; track slider.label) {
        <div uiField>
          <div
            uiSlider
            [defaultValue]="slider.defaultValue"
            [max]="slider.max"
            [step]="slider.step"
            [format]="slider.format"
            [locale]="'locale' in slider ? slider.locale : undefined"
          >
            <div data-slot="row">
              <label uiFieldLabel>{{ slider.label }}</label>
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
      }
    </div>
  `,
})
class Example {
  readonly sliders = [
    {
      label: "Budget",
      defaultValue: 40,
      max: 100,
      step: 1,
      format: { style: "currency", currency: "USD", maximumFractionDigits: 0 },
    },
    {
      label: "Opacity",
      defaultValue: 0.6,
      max: 1,
      step: 0.01,
      format: { style: "percent" },
    },
    {
      label: "Weight",
      defaultValue: 20,
      max: 50,
      step: 0.5,
      format: { style: "unit", unit: "kilogram" },
    },
    {
      label: "Duration",
      defaultValue: 90,
      max: 600,
      step: 15,
      format: (seconds: number) =>
        `${Math.floor(seconds / 60)} min ${seconds % 60} s`,
    },
    {
      label: "Preis",
      defaultValue: 40,
      max: 100,
      step: 1,
      format: { style: "currency", currency: "EUR" },
      locale: "de-DE",
    },
  ] satisfies {
    label: string
    defaultValue: number
    max: number
    step: number
    format: Intl.NumberFormatOptions | ((value: number) => string)
    locale?: string
  }[]
}

export { Example }
