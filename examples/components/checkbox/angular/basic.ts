import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/angular/checkbox"

@Component({
  imports: [Checkbox, CheckboxIndicator, LucideCheck],
  template: `
    <label data-slot="label">
      <button uiCheckbox>
        <span uiCheckboxIndicator>
          <svg lucideCheck></svg>
        </span>
      </button>
      Accept terms and conditions
    </label>
  `,
})
class Example {}

export { Example }
