import { Component, signal } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  Checkbox,
  CheckboxGroup,
  CheckboxIndicator,
  createCheckboxGroupController,
  type CheckboxGroupValueChange,
} from "@ui-sdk/angular/checkbox"

@Component({
  imports: [Checkbox, CheckboxGroup, CheckboxIndicator, LucideCheck],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="schedule.setValue(weekdays)">
          Select Weekdays
        </button>
        <button type="button" (click)="schedule.setValue([])">Clear</button>
      </div>
      <h3 id="controlled-days">Working days</h3>
      <div
        uiCheckboxGroup
        [(value)]="value"
        aria-labelledby="controlled-days"
        [controller]="schedule"
        (beforeValueChange)="onValueChange($event)"
      >
        @for (day of days; track day.value) {
          <label data-slot="label">
            <button uiCheckbox [value]="day.value">
              <span uiCheckboxIndicator>
                <svg lucideCheck></svg>
              </span>
            </button>
            {{ day.label }}
          </label>
        }
      </div>
    </div>
  `,
})
class Example {
  readonly days = [
    { value: "mon", label: "Monday" },
    { value: "tue", label: "Tuesday" },
    { value: "wed", label: "Wednesday" },
    { value: "thu", label: "Thursday" },
    { value: "fri", label: "Friday" },
    { value: "sat", label: "Saturday" },
    { value: "sun", label: "Sunday" },
  ]

  readonly weekdays = ["mon", "tue", "wed", "thu", "fri"]

  readonly log = useLog()

  readonly schedule = createCheckboxGroupController()

  readonly value = signal(["mon", "tue"])

  onValueChange(change: CheckboxGroupValueChange) {
    const names = this.days
      .filter((day) => change.value.includes(day.value))
      .map((day) => day.label)
    this.log(`${names.join(", ") || "No days"} (${change.reason})`)
  }
}

export { Example }
