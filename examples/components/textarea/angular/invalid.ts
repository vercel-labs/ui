import { Component } from "@angular/core"
import { Field, FieldError, FieldLabel } from "@ui-sdk/angular/field"
import { Textarea } from "@ui-sdk/angular/textarea"

@Component({
  imports: [Field, FieldError, FieldLabel, Textarea],
  template: `
    <div uiField invalid>
      <label uiFieldLabel>Review</label>
      <textarea uiTextarea defaultValue="Great."></textarea>
      <div *uiFieldError="true">Write at least 20 characters.</div>
    </div>
  `,
})
class Example {}

export { Example }
