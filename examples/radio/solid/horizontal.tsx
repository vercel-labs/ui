import { Radio, RadioGroup } from "@ui-sdk/solid/radio"
import { For } from "solid-js"

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
        <For each={sizes}>{(size) => <Radio value={size.value}>{size.label}</Radio>}</For>
      </RadioGroup>
    </div>
  )
}
