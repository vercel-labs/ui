import { Component } from "@angular/core"
import { DateInput } from "@ui-sdk/angular/date-input"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/angular/field"

@Component({
  imports: [DateInput, Field, FieldDescription, FieldLabel],
  template: `
    <div uiField>
      <label uiFieldLabel>Birthday</label>
      <div uiDateInput name="birthday"></div>
      <p uiFieldDescription>We send a card on the day.</p>
    </div>
  `,
})
class Example {}

export { Example }
