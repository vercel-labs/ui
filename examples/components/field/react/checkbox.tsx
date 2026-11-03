import { Checkbox, CheckboxIndicator } from "@ui-sdk/react/checkbox"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/react/field"
import { CheckIcon } from "lucide-react"

export function Example() {
  return (
    <Field>
      <Checkbox name="usage">
        <CheckboxIndicator>
          <CheckIcon />
        </CheckboxIndicator>
      </Checkbox>
      <div data-slot="stack">
        <FieldLabel>Share usage data</FieldLabel>
        <FieldDescription>
          Help us improve by sending anonymous crash reports and usage statistics.
        </FieldDescription>
      </div>
    </Field>
  )
}
