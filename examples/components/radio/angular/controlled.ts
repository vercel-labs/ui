import { Component, signal } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  createRadioGroupController,
  Radio,
  RadioGroup,
  RadioIndicator,
} from "@ui-sdk/angular/radio"

@Component({
  imports: [Field, FieldLabel, Radio, RadioGroup, RadioIndicator],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="planGroup.setValue('team')">
          Choose Team
        </button>
      </div>
      <div uiField>
        <label uiFieldLabel>Plan</label>
        <div
          uiRadioGroup
          [(value)]="value"
          (beforeValueChange)="
            log(
              (plans.find((plan) => plan.value === $event.value)?.label ??
                'None') +
                ' (' +
                $event.reason +
                ')'
            )
          "
          [controller]="planGroup"
        >
          @for (plan of plans; track plan.value) {
            <label data-slot="label">
              <button uiRadio [value]="plan.value">
                <span uiRadioIndicator></span>
              </button>
              {{ plan.label }}
            </label>
          }
        </div>
      </div>
    </div>
  `,
})
class Example {
  readonly plans = [
    { value: "starter", label: "Starter" },
    { value: "pro", label: "Pro" },
    { value: "team", label: "Team" },
  ]

  readonly log = useLog()

  readonly planGroup = createRadioGroupController()

  readonly value = signal<string | null>("pro")
}

export { Example }
