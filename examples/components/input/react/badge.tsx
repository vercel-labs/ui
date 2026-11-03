import { Field, FieldDescription, FieldLabel } from "@ui-sdk/react/field"
import { Input } from "@ui-sdk/react/input"

export function Example() {
  return (
    <Field name="webhook">
      <FieldLabel>
        Webhook URL
        <span data-slot="row">Recommended</span>
      </FieldLabel>
      <Input type="url" placeholder="https://example.com/hooks" />
      <FieldDescription>We'll post an event here for every new order.</FieldDescription>
    </Field>
  )
}
