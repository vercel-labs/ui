import { createRadioGroupController } from "@ui-sdk/solid/radio"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/solid/radio"
import { createSignal, For } from "solid-js"

type Plan = "starter" | "pro" | "team"

const plans: { value: Plan; label: string }[] = [
  { value: "starter", label: "Starter" },
  { value: "pro", label: "Pro" },
  { value: "team", label: "Team" },
]

function Example() {
  const planGroup = createRadioGroupController<Plan>()
  const [value, setValue] = createSignal<Plan | null>("pro")
  const [reason, setReason] = createSignal("")

  return (
    <div data-slot="stack">
      <RadioGroup
        aria-label="Plan"
        value={value()}
        onValueChange={(next, details) => {
          setValue(next)
          setReason(details.reason)
        }}
        controller={planGroup}
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
      <button type="button" onClick={() => planGroup.setValue("team")}>
        Choose Team
      </button>
      <div data-slot="stack">
        <output data-slot="output">
          Value: {value() ?? "none"}
          {reason() && `, last change: ${reason()}`}
        </output>
      </div>
    </div>
  )
}

export { Example }
