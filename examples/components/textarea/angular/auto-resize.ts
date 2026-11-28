import { Component } from "@angular/core"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/angular/field"
import { Textarea } from "@ui-sdk/angular/textarea"

@Component({
  imports: [Field, FieldDescription, FieldLabel, Textarea],
  template: `
    <div uiField name="notes">
      <label uiFieldLabel>Notes</label>
      <textarea
        uiTextarea
        autoResize
        placeholder="Add notes for the delivery driver…"
      ></textarea>
      <p uiFieldDescription>Your driver sees these notes.</p>
    </div>
  `,
})
class Example {}

export { Example }
