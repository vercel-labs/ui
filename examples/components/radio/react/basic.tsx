import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/react/radio"

const options = [
  { value: "default", label: "Default" },
  { value: "comfortable", label: "Comfortable" },
  { value: "compact", label: "Compact" },
]

function Example() {
  return (
    <RadioGroup defaultValue="comfortable" aria-label="Density">
      {options.map((option) => (
        <label data-slot="label" key={option.value}>
          <Radio value={option.value}>
            <RadioIndicator />
          </Radio>
          {option.label}
        </label>
      ))}
    </RadioGroup>
  )
}

export { Example }
