import { Field, FieldDescription, FieldLabel } from "@ui-sdk/react/field"
import { Textarea } from "@ui-sdk/react/textarea"

export function Example() {
  return (
    <Field name="notes">
      <FieldLabel>Notes</FieldLabel>
      <Textarea autoResize placeholder="Type a few lines…" />
      <FieldDescription>Grows as you type, then scrolls.</FieldDescription>
    </Field>
  )
}
