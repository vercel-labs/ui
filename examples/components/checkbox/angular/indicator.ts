import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/angular/checkbox"

@Component({
  imports: [Checkbox, CheckboxIndicator, LucideCheck],
  template: `
    <div data-slot="stack">
      @for (task of tasks; track task.label) {
        <label data-slot="label">
          <button uiCheckbox [defaultChecked]="task.done">
            <span uiCheckboxIndicator>
              <svg lucideCheck></svg>
            </span>
          </button>
          {{ task.label }}
        </label>
      }
    </div>
  `,
})
class Example {
  readonly tasks = [
    { label: "Write the release notes", done: false },
    { label: "Update the changelog", done: true },
    { label: "Tag the release", done: false },
  ]
}

export { Example }
