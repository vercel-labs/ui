import { Component } from "@angular/core"
import {
  Meter,
  MeterIndicator,
  MeterTrack,
  MeterValue,
} from "@ui-sdk/angular/meter"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [Meter, MeterIndicator, MeterTrack, MeterValue],
  template: `
    <div class="fixture">
      <button>Before</button>
      <section
        uiMeter
        #meter="uiMeter"
        class="gauge"
        aria-label="Memory"
        [value]="value()"
        [class.is-high]="meter.state().percent >= 80"
        [class.is-ok]="meter.state().percent < 80"
      >
        <span uiMeterValue #text="uiMeterValue"
          >{{ text.state().text }} used</span
        >
        <div uiMeterTrack class="gauge-track">
          <div uiMeterIndicator class="gauge-indicator"></div>
        </div>
      </section>
      <button (click)="value.set(90)">Fill</button>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
    </div>
  `,
})
class Fixture {
  readonly value = state(40)
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
