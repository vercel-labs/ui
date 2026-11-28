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
      <label uiFieldLabel>Delivery date</label>
      <div
        uiDateInput
        defaultValue="2026-11-02"
        [unavailable]="{ weekday: [0, 6] }"
      ></div>
      <p uiFieldDescription>We deliver Monday to Friday.</p>
      <div *uiFieldError></div>
    </div>
  `,
})
class Example {}

export { Example }
