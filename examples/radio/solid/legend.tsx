import { createUniqueId } from "solid-js"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/solid/radio"
import { For } from "solid-js"

const plans = [
  { value: "monthly", label: "Monthly", price: "$9.99/month" },
  { value: "yearly", label: "Yearly", price: "$99.99/year" },
  { value: "lifetime", label: "Lifetime", price: "$299.99" },
]

function Example() {
  const id = createUniqueId()
  return (
    <fieldset data-slot="stack">
      <legend id={`${id}-subscription-legend`}>Subscription plan</legend>
      <p data-slot="hint" id={`${id}-subscription-hint`}>
        Yearly and lifetime plans offer significant savings.
      </p>
      <RadioGroup
        defaultValue="monthly"
        aria-labelledby={`${id}-subscription-legend`}
        aria-describedby={`${id}-subscription-hint`}
      >
        <For each={plans}>
          {(plan) => (
            <label data-slot="label">
              <Radio value={plan.value}>
                <RadioIndicator />
              </Radio>
              {plan.label} <span data-slot="hint">{plan.price}</span>
            </label>
          )}
        </For>
      </RadioGroup>
    </fieldset>
  )
}

export { Example }
