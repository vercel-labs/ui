import { Component } from "@angular/core"
import {
  Meter,
  MeterIndicator,
  MeterLabel,
  MeterTrack,
  MeterValue,
} from "@ui-sdk/angular/meter"

@Component({
  imports: [Meter, MeterIndicator, MeterLabel, MeterTrack, MeterValue],
  template: `
    <div data-slot="stack">
      @for (item of meters; track item.label) {
        <div
          uiMeter
          [value]="item.value"
          [max]="item.max"
          [format]="item.format"
          [locale]="item.locale"
        >
          <span uiMeterLabel>{{ item.label }}</span>
          <span uiMeterValue></span>
          <div uiMeterTrack>
            <div uiMeterIndicator></div>
          </div>
        </div>
      }
    </div>
  `,
})
class Example {
  readonly meters = [
    {
      label: "Storage",
      value: 120,
      max: 250,
      format: { style: "unit", unit: "gigabyte" },
    },
    {
      label: "Budget",
      value: 1840,
      max: 2500,
      format: { style: "currency", currency: "USD", maximumFractionDigits: 0 },
    },
    {
      label: "Seats",
      value: 18,
      max: 25,
      format: (seats: number) => `${seats} of 25 seats`,
    },
    { label: "Auslastung", value: 40, locale: "de-DE" },
  ] satisfies {
    label: string
    value: number
    max?: number
    format?: Intl.NumberFormatOptions | ((value: number) => string)
    locale?: string
  }[]
}

export { Example }
