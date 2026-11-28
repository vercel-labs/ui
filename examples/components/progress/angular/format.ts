import { Component } from "@angular/core"
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@ui-sdk/angular/progress"

@Component({
  imports: [
    Progress,
    ProgressIndicator,
    ProgressLabel,
    ProgressTrack,
    ProgressValue,
  ],
  template: `
    <div data-slot="stack">
      @for (item of bars; track item.label) {
        <div
          uiProgress
          [value]="item.value"
          [max]="item.max"
          [format]="item.format"
          [locale]="item.locale"
        >
          <span uiProgressLabel>{{ item.label }}</span>
          <span uiProgressValue></span>
          <div uiProgressTrack>
            <div uiProgressIndicator></div>
          </div>
        </div>
      }
    </div>
  `,
})
class Example {
  readonly bars = [
    {
      label: "Download",
      value: 120,
      max: 250,
      format: { style: "unit", unit: "gigabyte" },
    },
    {
      label: "Video render",
      value: 87.25,
      format: { style: "percent", maximumFractionDigits: 1 },
    },
    {
      label: "Backup",
      value: 45,
      max: 60,
      format: (minutes: number) => `${60 - minutes} min left`,
    },
    { label: "Synchronisierung", value: 40, locale: "de-DE" },
  ] satisfies {
    label: string
    value: number
    max?: number
    format?: Intl.NumberFormatOptions | ((value: number) => string)
    locale?: string
  }[]
}

export { Example }
