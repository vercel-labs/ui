"use client"

import { createRadioGroupController } from "@ui-sdk/react/radio"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/react/radio"
import * as React from "react"

type Plan = "starter" | "pro" | "team"

const plans: { value: Plan; label: string }[] = [
  { value: "starter", label: "Starter" },
  { value: "pro", label: "Pro" },
  { value: "team", label: "Team" },
]

function Example() {
  const [planGroup] = React.useState(() => createRadioGroupController<Plan>())
  const [value, setValue] = React.useState<Plan | null>("pro")
  const [reason, setReason] = React.useState("")

  return (
    <div data-slot="stack">
      <RadioGroup
        aria-label="Plan"
        value={value}
        onValueChange={(next, details) => {
          setValue(next)
          setReason(details.reason)
        }}
        controller={planGroup}
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
      <button type="button" onClick={() => planGroup.setValue("team")}>
        Choose Team
      </button>
      <div data-slot="stack">
        <output data-slot="output">
          Value: {value ?? "none"}
          {reason && `, last change: ${reason}`}
        </output>
      </div>
    </div>
  )
}

export { Example }
