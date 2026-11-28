import { Component } from "@angular/core"
import { FieldDescription, FieldLegend, FieldSet } from "@ui-sdk/angular/field"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/angular/radio"

let nextId = 0

@Component({
  imports: [
    FieldDescription,
    FieldLegend,
    FieldSet,
    Radio,
    RadioGroup,
    RadioIndicator,
  ],
  template: `
    <fieldset uiFieldSet>
      <legend uiFieldLegend [id]="\`\${id}-legend\`">Billing period</legend>
      <p uiFieldDescription [id]="\`\${id}-description\`">
        Yearly billing gets you two months free.
      </p>
      <div
        uiRadioGroup
        defaultValue="monthly"
        [aria-labelledby]="\`\${id}-legend\`"
        [aria-describedby]="\`\${id}-description\`"
      >
        @for (period of periods; track period.value) {
          <label data-slot="label">
            <button uiRadio [value]="period.value">
              <span uiRadioIndicator></span>
            </button>
            {{ period.label }}
            <span data-slot="hint">({{ period.price }})</span>
          </label>
        }
      </div>
    </fieldset>
  `,
})
class Example {
  readonly periods = [
    { value: "monthly", label: "Monthly", price: "$12 per month" },
    { value: "yearly", label: "Yearly", price: "$120 per year" },
  ]

  readonly id = `plan-${nextId++}`
}

export { Example }
