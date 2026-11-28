import { Component } from "@angular/core"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/angular/field"
import { Switch, SwitchThumb } from "@ui-sdk/angular/switch"

@Component({
  imports: [Field, FieldDescription, FieldLabel, Switch, SwitchThumb],
  template: `
    <div uiField>
      <div data-slot="stack">
        <label uiFieldLabel>Encrypt backups</label>
        <p uiFieldDescription>Your organization manages this setting.</p>
      </div>
      <button uiSwitch name="encrypt" defaultChecked readOnly>
        <span uiSwitchThumb></span>
      </button>
    </div>
  `,
})
class Example {}

export { Example }
