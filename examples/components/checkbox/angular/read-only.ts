import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/angular/checkbox"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/angular/field"

@Component({
  imports: [
    Checkbox,
    CheckboxIndicator,
    Field,
    FieldDescription,
    FieldLabel,
    LucideCheck,
  ],
  template: `
    <div uiField>
      <button uiCheckbox name="two-factor" defaultChecked readOnly>
        <span uiCheckboxIndicator>
          <svg lucideCheck></svg>
        </span>
      </button>
      <div data-slot="stack">
        <label uiFieldLabel>Require two-factor authentication</label>
        <p uiFieldDescription>Your organization requires this setting.</p>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
