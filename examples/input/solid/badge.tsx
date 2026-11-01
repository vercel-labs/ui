import { Field, FieldDescription, FieldLabel } from "@ui-sdk/solid/field"
import { Input } from "@ui-sdk/solid/input"

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
