import { Field, FieldControl, FieldDescription, FieldLabel } from "@ui-sdk/react/field"

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
      <FieldControl render={<select />} name="department" defaultValue="">
        <option value="" disabled>
          Choose department
        </option>
        {departments.map((department) => (
          <option key={department.value} value={department.value}>
            {department.label}
          </option>
        ))}
      </FieldControl>
      <FieldDescription>Select your department or area of work.</FieldDescription>
    </Field>
  )
}
