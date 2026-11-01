import { Checkbox, CheckboxGroup, CheckboxIndicator } from "@ui-sdk/react/checkbox"
import { FieldDescription, FieldLegend, FieldSet } from "@ui-sdk/react/field"
import { Check } from "lucide-react"

const items = [
  { value: "comments", label: "Comments on your posts" },
  { value: "mentions", label: "Mentions" },
  { value: "follows", label: "New followers" },
]

export function Example() {
  return (
    <FieldSet>
      <FieldLegend>Notifications</FieldLegend>
      <FieldDescription>Choose what we email you about.</FieldDescription>
      <CheckboxGroup name="notify" defaultValue={["mentions"]}>
        {items.map((item) => (
          <label data-slot="label" key={item.value}>
            <Checkbox value={item.value}>
              <CheckboxIndicator>
                <Check aria-hidden="true" />
              </CheckboxIndicator>
            </Checkbox>
            {item.label}
          </label>
        ))}
      </CheckboxGroup>
    </FieldSet>
  )
}
