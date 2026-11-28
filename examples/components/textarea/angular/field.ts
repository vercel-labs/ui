import { Component } from "@angular/core"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/angular/field"
import { Textarea } from "@ui-sdk/angular/textarea"

@Component({
  imports: [Field, FieldDescription, FieldLabel, Textarea],
  template: `
    <div uiField name="feedback">
      <label uiFieldLabel>Feedback</label>
      <textarea uiTextarea placeholder="What could we do better?"></textarea>
      <p uiFieldDescription>Only the product team can see this.</p>
    </div>
  `,
})
class Example {}

export { Example }
