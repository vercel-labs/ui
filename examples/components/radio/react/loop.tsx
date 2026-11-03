import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/react/radio"

const priorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
]

function Example() {
  return (
    <RadioGroup defaultValue="low" loop={false} aria-label="Priority">
      {priorities.map((priority) => (
        <label data-slot="label" key={priority.value}>
          <Radio value={priority.value}>
            <RadioIndicator />
          </Radio>
          {priority.label}
        </label>
      ))}
    </RadioGroup>
  )
}

export { Example }
