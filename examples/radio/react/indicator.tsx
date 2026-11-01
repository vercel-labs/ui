import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/react/radio"

const themes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
]

function Example() {
  return (
    <RadioGroup defaultValue="system" aria-label="Theme">
      {themes.map((theme) => (
        <label data-slot="label" key={theme.value}>
          <Radio value={theme.value}>
            <RadioIndicator keepMounted />
          </Radio>
          {theme.label}
        </label>
      ))}
    </RadioGroup>
  )
}

export { Example }
