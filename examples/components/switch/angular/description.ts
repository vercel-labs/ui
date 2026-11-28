import { Component } from "@angular/core"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/angular/field"
import { Switch, SwitchThumb } from "@ui-sdk/angular/switch"

@Component({
  imports: [Field, FieldDescription, FieldLabel, Switch, SwitchThumb],
  template: `
    <div uiField>
      <div data-slot="stack">
        <label uiFieldLabel>Weekly digest</label>
        <p uiFieldDescription>A summary of your week, every Monday.</p>
      </div>
      <button uiSwitch>
        <span uiSwitchThumb></span>
      </button>
    </div>
  `,
})
class Example {}

export { Example }
