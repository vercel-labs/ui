"use client"

import * as React from "react"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/react/radio"

const plans = [
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
  { value: "team", label: "Team" },
]

function Example() {
  const id = React.useId()
  return (
    <div data-slot="stack">
      <div data-slot="stack">
        <span id={`${id}-current-plan`}>Your plan</span>
        <p data-slot="hint" id={`${id}-current-plan-hint`}>
          Ask an admin to change plans.
        </p>
      </div>
      <RadioGroup
        defaultValue="pro"
        readOnly
        aria-labelledby={`${id}-current-plan`}
        aria-describedby={`${id}-current-plan-hint`}
      >
        {plans.map((plan) => (
          <label data-slot="label" key={plan.value}>
            <Radio value={plan.value}>
              <RadioIndicator />
            </Radio>
            {plan.label}
          </label>
        ))}
      </RadioGroup>
    </div>
  )
}

export { Example }
