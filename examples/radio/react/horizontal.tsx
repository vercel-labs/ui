import { Radio, RadioGroup } from "@ui-sdk/react/radio"

const sizes = [
  { value: "s", label: "S" },
  { value: "m", label: "M" },
  { value: "l", label: "L" },
  { value: "xl", label: "XL" },
]

export function Example() {
  return (
    <div data-slot="stack">
      <span id="size-heading">Size</span>
      <RadioGroup data-variant="segmented" defaultValue="m" aria-labelledby="size-heading">
        {sizes.map((size) => (
          <Radio key={size.value} value={size.value}>
            {size.label}
          </Radio>
        ))}
      </RadioGroup>
    </div>
  )
}
