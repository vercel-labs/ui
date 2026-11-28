import { Component } from "@angular/core"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/angular/field"
import { Input } from "@ui-sdk/angular/input"

@Component({
  imports: [Field, FieldDescription, FieldLabel, Input],
  template: `
    <div data-slot="stack">
      <div uiField>
        <label uiFieldLabel>Username</label>
        <input
          uiInput
          name="username"
          placeholder="hollis"
          autocomplete="username"
        />
        <p uiFieldDescription>Choose a unique username for your account.</p>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
