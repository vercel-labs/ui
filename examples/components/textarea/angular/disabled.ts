import { Component } from "@angular/core"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import { Textarea } from "@ui-sdk/angular/textarea"

@Component({
  imports: [Field, FieldLabel, Textarea],
  template: `
    <div uiField disabled>
      <label uiFieldLabel>Reply</label>
      <textarea
        uiTextarea
        defaultValue="Replies are closed for this thread."
      ></textarea>
    </div>
  `,
})
class Example {}

export { Example }
