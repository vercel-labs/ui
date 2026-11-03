import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/solid/radio"
import { For } from "solid-js"

const plans = [
  { value: "plus", label: "Plus", description: "For individuals and small teams." },
  { value: "pro", label: "Pro", description: "For growing businesses." },
  { value: "enterprise", label: "Enterprise", description: "For large teams and enterprises." },
]

function Example() {
  return (
    <RadioGroup defaultValue="plus" aria-label="Plan">
      <For each={plans}>
        {(plan) => (
          <label data-slot="card">
            <span data-slot="stack">
              <span>{plan.label}</span>
              <span data-slot="hint">{plan.description}</span>
            </span>
            <Radio value={plan.value}>
              <RadioIndicator />
            </Radio>
          </label>
        )}
      </For>
    </RadioGroup>
  )
}

export { Example }
