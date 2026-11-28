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
    <div uiMeter [value]="68">
      <span uiMeterLabel>Storage used</span>
      <span uiMeterValue></span>
      <div uiMeterTrack>
        <div uiMeterIndicator></div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
