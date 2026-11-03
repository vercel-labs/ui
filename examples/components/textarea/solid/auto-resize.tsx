import { Field, FieldDescription, FieldLabel } from "@ui-sdk/solid/field"
import { Textarea } from "@ui-sdk/solid/textarea"

export function Example() {
  return (
    <Field name="notes">
      <FieldLabel>Notes</FieldLabel>
      <Textarea autoResize placeholder="Type a few lines…" />
      <FieldDescription>Grows as you type, then scrolls.</FieldDescription>
    </Field>
  )
}
