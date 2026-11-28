import { Component } from "@angular/core"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import { TimeInput } from "@ui-sdk/angular/time-input"

@Component({
  imports: [Field, FieldLabel, TimeInput],
  template: `
    <div data-slot="stack">
      <div uiField>
        <label uiFieldLabel>12-hour clock</label>
        <div uiTimeInput [hourCycle]="12" defaultValue="18:45"></div>
      </div>
      <div uiField>
        <label uiFieldLabel>24-hour clock</label>
        <div uiTimeInput [hourCycle]="24" defaultValue="18:45"></div>
      </div>
      <div uiField>
        <label uiFieldLabel>With seconds</label>
        <div
          uiTimeInput
          granularity="second"
          [hourCycle]="24"
          defaultValue="18:45:30"
        ></div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
