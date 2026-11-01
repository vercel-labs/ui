"use client"

import * as React from "react"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/react/radio"

const plans = [
  { value: "monthly", label: "Monthly", price: "$9.99/month" },
  { value: "yearly", label: "Yearly", price: "$99.99/year" },
  { value: "lifetime", label: "Lifetime", price: "$299.99" },
]

function Example() {
  const id = React.useId()
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
        {plans.map((plan) => (
          <label data-slot="label" key={plan.value}>
            <Radio value={plan.value}>
              <RadioIndicator />
            </Radio>
            {plan.label} <span data-slot="hint">{plan.price}</span>
          </label>
        ))}
      </RadioGroup>
    </fieldset>
  )
}

export { Example }
