import { Field, FieldLabel } from "@ui-sdk/react/field"
import { Input, InputGroup } from "@ui-sdk/react/input"

export function Example() {
  return (
    <div data-slot="stack">
      <Field name="website">
        <FieldLabel>Website</FieldLabel>
        <InputGroup>
          <span>https://</span>
          <Input placeholder="example" />
          <span>.com</span>
        </InputGroup>
      </Field>
    </div>
  )
}
