import { FieldLegend, FieldSet } from "@ui-sdk/react/field"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/react/radio"

const plans = [
  { value: "monthly", label: "Monthly", price: "$12 a month" },
  { value: "yearly", label: "Yearly", price: "$120 a year" },
]

export function Example() {
  return (
    <FieldSet>
      <FieldLegend render={<div />}>Billing period</FieldLegend>
      <RadioGroup name="period" defaultValue="monthly">
        {plans.map((plan) => (
          <label data-slot="card" key={plan.value}>
            <span data-slot="row">
              <Radio value={plan.value}>
                <RadioIndicator />
              </Radio>
              {plan.label}
            </span>
            <span data-slot="hint">{plan.price}</span>
          </label>
        ))}
      </RadioGroup>
    </FieldSet>
  )
}
