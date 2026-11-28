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
      <button uiCheckbox>
        <span uiCheckboxIndicator>
          <svg lucideCheck></svg>
        </span>
      </button>
      <div data-slot="stack">
        <label uiFieldLabel>Accept terms and conditions</label>
        <p uiFieldDescription>
          By clicking this checkbox, you agree to the terms and conditions.
        </p>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
