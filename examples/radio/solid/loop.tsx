import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/solid/radio"
import { For } from "solid-js"

const priorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
]

function Example() {
  return (
    <RadioGroup defaultValue="low" loop={false} aria-label="Priority">
      <For each={priorities}>
        {(priority) => (
          <label data-slot="label">
            <Radio value={priority.value}>
              <RadioIndicator />
            </Radio>
            {priority.label}
          </label>
        )}
      </For>
    </RadioGroup>
  )
}

export { Example }
