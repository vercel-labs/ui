import { Component } from "@angular/core"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import { TimeInput } from "@ui-sdk/angular/time-input"

@Component({
  imports: [Field, FieldLabel, TimeInput],
  template: `
    <div uiField>
      <label uiFieldLabel>Meeting time</label>
      <div uiTimeInput defaultValue="09:30"></div>
    </div>
  `,
})
class Example {}

export { Example }
