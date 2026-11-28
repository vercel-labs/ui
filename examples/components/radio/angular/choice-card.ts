import { Component } from "@angular/core"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/angular/radio"

@Component({
  imports: [Field, FieldLabel, Radio, RadioGroup, RadioIndicator],
  template: `
    <div uiField>
      <label uiFieldLabel>Plan</label>
      <div uiRadioGroup defaultValue="hobby">
        @for (plan of plans; track plan.value) {
          <label data-slot="card">
            <span data-slot="stack">
              <span>{{ plan.label }}</span>
              <span data-slot="hint">{{ plan.description }}</span>
            </span>
            <button uiRadio [value]="plan.value">
              <span uiRadioIndicator></span>
            </button>
          </label>
        }
      </div>
    </div>
  `,
})
class Example {
  readonly plans = [
    {
      value: "hobby",
      label: "Hobby",
      description: "Free for personal projects.",
    },
    {
      value: "pro",
      label: "Pro",
      description: "$20 per month for growing teams.",
    },
    {
      value: "enterprise",
      label: "Enterprise",
      description: "Custom pricing and support.",
    },
  ]
}

export { Example }
