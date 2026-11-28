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
      <label uiFieldLabel>Email notifications</label>
      <div uiRadioGroup defaultValue="daily">
        @for (frequency of frequencies; track frequency.value) {
          <div uiField>
            <button uiRadio [value]="frequency.value">
              <span uiRadioIndicator></span>
            </button>
            <div data-slot="stack">
              <label uiFieldLabel>{{ frequency.label }}</label>
              <p uiFieldDescription>{{ frequency.description }}</p>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
class Example {
  readonly frequencies = [
    {
      value: "instant",
      label: "Instantly",
      description: "An email right away.",
    },
    {
      value: "daily",
      label: "Daily digest",
      description: "One email each morning.",
    },
    {
      value: "weekly",
      label: "Weekly digest",
      description: "A summary every Monday.",
    },
  ]
}

export { Example }
