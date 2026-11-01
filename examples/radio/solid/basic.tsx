import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/solid/radio"
import { For } from "solid-js"

const options = [
  { value: "default", label: "Default" },
  { value: "comfortable", label: "Comfortable" },
  { value: "compact", label: "Compact" },
]

function Example() {
  return (
    <RadioGroup defaultValue="comfortable" aria-label="Density">
      <For each={options}>
        {(option) => (
          <label data-slot="label">
            <Radio value={option.value}>
              <RadioIndicator />
            </Radio>
            {option.label}
          </label>
        )}
      </For>
    </RadioGroup>
  )
}

export { Example }
