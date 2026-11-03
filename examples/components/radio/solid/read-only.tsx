import { createUniqueId } from "solid-js"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/solid/radio"
import { For } from "solid-js"

const plans = [
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
  { value: "team", label: "Team" },
]

function Example() {
  const id = createUniqueId()
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
        <For each={plans}>
          {(plan) => (
            <label data-slot="label">
              <Radio value={plan.value}>
                <RadioIndicator />
              </Radio>
              {plan.label}
            </label>
          )}
        </For>
      </RadioGroup>
    </div>
  )
}

export { Example }
