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
    <div uiMeter [value]="91">
      <span uiMeterLabel>Disk</span>
      <span uiMeterValue #meterValue="uiMeterValue">
        {{ meterValue.state().text }} used
      </span>
      <span uiMeterTrack>
        <div
          uiMeterIndicator
          #meterIndicator="uiMeterIndicator"
          [attr.data-variant]="
            meterIndicator.state().percent >= 90 ? 'destructive' : null
          "
        ></div>
      </span>
    </div>
  `,
})
class Example {}

export { Example }
