import "@ui-sdk/web/field"

const departments = [
  { value: "engineering", label: "Engineering" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "support", label: "Customer support" },
]

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-field>
      <ui-field-label>Department</ui-field-label>
      <select name="department">
        <option value="" disabled selected>Choose department</option>
        ${departments.map((department) => `<option value="${department.value}">${department.label}</option>`).join("")}
      </select>
      <ui-field-description>Select your department or area of work.</ui-field-description>
    </ui-field>
  `
}
