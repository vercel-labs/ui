import { Component } from "@angular/core"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/angular/field"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/angular/radio"

@Component({
  imports: [
    Field,
    FieldDescription,
    FieldLabel,
    Radio,
    RadioGroup,
    RadioIndicator,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Your plan</label>
      <p uiFieldDescription>Ask an admin to change plans.</p>
      <div uiRadioGroup defaultValue="pro" readOnly>
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
  `,
})
class Example {
  readonly plans = [
    { value: "free", label: "Free" },
    { value: "pro", label: "Pro" },
    { value: "team", label: "Team" },
  ]
}

export { Example }
