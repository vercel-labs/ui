import { Component } from "@angular/core"
import { DateInput } from "@ui-sdk/angular/date-input"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@ui-sdk/angular/field"

@Component({
  imports: [DateInput, Field, FieldDescription, FieldError, FieldLabel],
  template: `
    <div uiField>
      <label uiFieldLabel>Check-in</label>
      <div
        uiDateInput
        min="2026-01-01"
        max="2026-12-31"
        defaultValue="2026-06-15"
      ></div>
      <p uiFieldDescription>Any day in 2026.</p>
      <div *uiFieldError></div>
    </div>
  `,
})
class Example {}

export { Example }
