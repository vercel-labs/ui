import { Component } from "@angular/core"
import {
  Meter,
  MeterIndicator,
  MeterLabel,
  MeterTrack,
  MeterValue,
  type MeterOptions,
} from "@ui-sdk/angular/meter"

@Component({
  imports: [Meter, MeterIndicator, MeterLabel, MeterTrack, MeterValue],
  template: `
    <div uiMeter [value]="750" [max]="1000" [getValueLabel]="getValueLabel">
      <span uiMeterLabel>API requests</span>
      <span uiMeterValue>750 / 1,000</span>
      <div uiMeterTrack>
        <div uiMeterIndicator></div>
      </div>
    </div>
  `,
})
class Example {
  readonly getValueLabel: MeterOptions["getValueLabel"] = (value, details) =>
    `${value} of ${details.max} requests, ${details.formatted}`
}

export { Example }
