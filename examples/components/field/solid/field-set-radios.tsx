import { FieldLegend, FieldSet } from "@ui-sdk/solid/field"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/solid/radio"
import { For } from "solid-js"

const plans = [
  { value: "monthly", label: "Monthly", price: "$12 a month" },
  { value: "yearly", label: "Yearly", price: "$120 a year" },
]

export function Example() {
  return (
    <FieldSet>
      <FieldLegend render={(props) => <div {...props} />}>Billing period</FieldLegend>
      <RadioGroup name="period" defaultValue="monthly">
        <For each={plans}>
          {(plan) => (
            <label data-slot="card">
              <span data-slot="row">
                <Radio value={plan.value}>
                  <RadioIndicator />
                </Radio>
                {plan.label}
              </span>
              <span data-slot="hint">{plan.price}</span>
            </label>
          )}
        </For>
      </RadioGroup>
    </FieldSet>
  )
}
