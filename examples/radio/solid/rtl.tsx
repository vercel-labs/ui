import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/solid/radio"
import { For } from "solid-js"

const options = [
  { value: "default", label: "افتراضي" },
  { value: "comfortable", label: "مريح" },
  { value: "compact", label: "مضغوط" },
]

function Example() {
  return (
    <div dir="rtl">
      <RadioGroup defaultValue="comfortable" aria-label="الكثافة">
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
    </div>
  )
}

export { Example }
