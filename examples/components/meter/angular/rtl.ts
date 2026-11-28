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
    <div dir="rtl">
      <div uiMeter [value]="68" locale="ar-EG">
        <span uiMeterLabel>مساحة التخزين</span>
        <span uiMeterValue></span>
        <div uiMeterTrack>
          <div uiMeterIndicator></div>
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
