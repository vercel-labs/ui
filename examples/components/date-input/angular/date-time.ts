import { Component } from "@angular/core"
import { DateInput } from "@ui-sdk/angular/date-input"
import { Field, FieldLabel } from "@ui-sdk/angular/field"

@Component({
  imports: [DateInput, Field, FieldLabel],
  template: `
    <div uiField>
      <label uiFieldLabel>Departure</label>
      <div
        uiDateInput
        granularity="minute"
        defaultValue="2026-11-02T14:30"
      ></div>
    </div>
  `,
})
class Example {}

export { Example }
