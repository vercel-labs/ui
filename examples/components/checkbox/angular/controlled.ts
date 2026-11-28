import { Component, signal } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  Checkbox,
  CheckboxIndicator,
  createCheckboxController,
  type CheckedState,
} from "@ui-sdk/angular/checkbox"

@Component({
  imports: [Checkbox, CheckboxIndicator, LucideCheck],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="updates.toggle()">Toggle</button>
      </div>
      <label data-slot="label">
        <button
          uiCheckbox
          [(checked)]="checked"
          [controller]="updates"
          (beforeCheckedChange)="
            log(
              ($event.value === 'indeterminate'
                ? 'Mixed'
                : $event.value
                  ? 'Checked'
                  : 'Unchecked') +
                ' (' +
                $event.reason +
                ')'
            )
          "
        >
          <span uiCheckboxIndicator>
            <svg lucideCheck></svg>
          </span>
        </button>
        Email me about product updates
      </label>
    </div>
  `,
})
class Example {
  readonly log = useLog()

  readonly updates = createCheckboxController()

  readonly checked = signal<CheckedState>(false)
}

export { Example }
