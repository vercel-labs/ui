import { Component } from "@angular/core"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import { Textarea } from "@ui-sdk/angular/textarea"

@Component({
  imports: [Field, FieldLabel, Textarea],
  template: `
    <div uiField name="message">
      <label uiFieldLabel>Message</label>
      <textarea uiTextarea placeholder="Type your message here…"></textarea>
    </div>
  `,
})
class Example {}

export { Example }
