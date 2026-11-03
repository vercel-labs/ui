import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/react/radio"

const options = [
  { value: "default", label: "افتراضي" },
  { value: "comfortable", label: "مريح" },
  { value: "compact", label: "مضغوط" },
]

function Example() {
  return (
    <div dir="rtl">
      <RadioGroup defaultValue="comfortable" aria-label="الكثافة">
        {options.map((option) => (
          <label data-slot="label" key={option.value}>
            <Radio value={option.value}>
              <RadioIndicator />
            </Radio>
            {option.label}
          </label>
        ))}
      </RadioGroup>
    </div>
  )
}

export { Example }
