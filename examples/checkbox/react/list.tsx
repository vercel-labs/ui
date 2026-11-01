import { Checkbox, CheckboxIndicator } from "@ui-sdk/react/checkbox"
import { Check } from "lucide-react"

const items = [
  { value: "hard-disks", label: "Hard disks", checked: false },
  { value: "external-disks", label: "External disks", checked: true },
  { value: "media", label: "CDs, DVDs and iPods", checked: true },
  { value: "servers", label: "Connected servers", checked: false },
]

function Example() {
  return (
    <fieldset data-slot="stack">
      <legend>Show these items on the desktop</legend>
      <p data-slot="hint">Select the items you want to show on the desktop.</p>
      {items.map((item) => (
        <label data-slot="label" key={item.value}>
          <Checkbox name="desktop" value={item.value} defaultChecked={item.checked}>
            <CheckboxIndicator>
              <Check aria-hidden="true" />
            </CheckboxIndicator>
          </Checkbox>
          {item.label}
        </label>
      ))}
    </fieldset>
  )
}

export { Example }
