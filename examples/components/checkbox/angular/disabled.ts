import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/angular/checkbox"

@Component({
  imports: [Checkbox, CheckboxIndicator, LucideCheck],
  template: `
    <div data-slot="stack">
      <label data-slot="label">
        <button uiCheckbox defaultChecked>
          <span uiCheckboxIndicator>
            <svg lucideCheck></svg>
          </span>
        </button>
        Product updates
      </label>
      <label data-slot="label">
        <button uiCheckbox defaultChecked disabled>
          <span uiCheckboxIndicator>
            <svg lucideCheck></svg>
          </span>
        </button>
        Security alerts
      </label>
    </div>
  `,
})
class Example {}

export { Example }
