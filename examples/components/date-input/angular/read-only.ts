import { Component } from "@angular/core"
import { DateInput } from "@ui-sdk/angular/date-input"
import { Field, FieldLabel } from "@ui-sdk/angular/field"

@Component({
  imports: [DateInput, Field, FieldLabel],
  template: `
    <div uiField>
      <label uiFieldLabel>Signed on</label>
      <div uiDateInput defaultValue="2026-11-02" readOnly></div>
    </div>
  `,
})
class Example {}

export { Example }
