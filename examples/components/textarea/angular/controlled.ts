import { Component, signal } from "@angular/core"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/angular/field"
import { Textarea } from "@ui-sdk/angular/textarea"

@Component({
  imports: [Field, FieldDescription, FieldLabel, Textarea],
  template: `
    <div uiField name="bio">
      <label uiFieldLabel>Bio</label>
      <textarea uiTextarea [(value)]="bio" maxlength="160"></textarea>
      <p uiFieldDescription>{{ bio().length }} / 160 characters</p>
    </div>
  `,
})
class Example {
  readonly bio = signal(
    "Product designer in Lisbon. I write about type and interfaces."
  )
}

export { Example }
