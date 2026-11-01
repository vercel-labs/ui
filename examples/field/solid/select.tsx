import { Field, FieldControl, FieldDescription, FieldLabel } from "@ui-sdk/solid/field"
import { For } from "solid-js"

const departments = [
  { value: "engineering", label: "Engineering" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "support", label: "Customer support" },
]

export function Example() {
  return (
    <Field>
      <FieldLabel>Department</FieldLabel>
      <FieldControl render={(props) => <select {...props} />} name="department">
        <option value="" disabled selected>
          Choose department
        </option>
        <For each={departments}>
          {(department) => <option value={department.value}>{department.label}</option>}
        </For>
      </FieldControl>
      <FieldDescription>Select your department or area of work.</FieldDescription>
    </Field>
  )
}
