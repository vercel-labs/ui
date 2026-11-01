import { Field, FieldDescription, FieldLabel } from "@ui-sdk/react/field"
import { Input } from "@ui-sdk/react/input"

export function Example() {
  return (
    <Field name="avatar">
      <FieldLabel>Picture</FieldLabel>
      <Input type="file" accept="image/*" />
      <FieldDescription>PNG or JPG, up to 2 MB.</FieldDescription>
    </Field>
  )
}
