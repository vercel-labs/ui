import { Component } from "@angular/core"
import {
  Meter,
  MeterIndicator,
  MeterLabel,
  MeterTrack,
  MeterValue,
} from "@ui-sdk/angular/meter"
import { meterFixture } from "../../../../../tests/fixtures/meter"
import { mountAngular, state } from "../../angular-mount"

const { storage, requests, disk, score } = meterFixture

@Component({
  imports: [Meter, MeterIndicator, MeterLabel, MeterTrack, MeterValue],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div uiMeter class="gauge" [value]="value()">
        <span uiMeterLabel>{{ storage.label }}</span>
        <span uiMeterValue class="gauge-value"></span>
        <div uiMeterTrack class="gauge-track">
          <div uiMeterIndicator class="gauge-indicator"></div>
        </div>
      </div>
      @for (item of meters; track item.label) {
        <div
          uiMeter
          class="gauge"
          [value]="item.value"
          [min]="item.min"
          [max]="item.max"
          [format]="item.format"
          [getValueLabel]="item.getValueLabel"
        >
          <span uiMeterLabel>{{ item.label }}</span>
          <span uiMeterValue class="gauge-value"></span>
          <div uiMeterTrack class="gauge-track">
            <div uiMeterIndicator class="gauge-indicator"></div>
          </div>
        </div>
      }
      <button (click)="value.set(value() + storage.step)">Fill</button>
      <button (click)="value.set(storage.value)">Reset</button>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
    </div>
  `,
})
class Fixture {
  readonly storage = storage
  readonly value = state(storage.value)
  readonly meters: {
    label: string
    value: number
    min?: number
    max?: number
    format?: Intl.NumberFormatOptions
    getValueLabel?: (value: number) => string
  }[] = [
    {
      label: requests.label,
      value: requests.value,
      max: requests.max,
      getValueLabel: requests.valueLabel,
    },
    {
      label: disk.label,
      value: disk.value,
      max: disk.max,
      format: disk.format,
    },
    { label: score.label, value: score.value, min: score.min, max: score.max },
  ]
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
