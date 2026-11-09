// Every scenario in the kitchen sink. Each framework renders the same list.
type Variant = {
  id: string
  section: "Basics" | "Form" | "State" | "Rendering"
  title: string
  note?: string
  // Options passed as they are.
  options?: Record<string, unknown>
  // The toggle renders as a span.
  render?: "span"
  place?: "rtl"
  controlled?: boolean
  controller?: boolean
  // Cancels every visibility change from the change callback.
  cancel?: boolean
  // Inside a form with Submit and Reset buttons, which log.
  form?: boolean
  // Inside a Field, with a label and a description.
  field?: boolean
}

const variants: Variant[] = [
  { id: "default", section: "Basics", title: "Default" },
  {
    id: "default-visible",
    section: "Basics",
    title: "defaultVisible",
    options: { defaultVisible: true },
  },
  {
    id: "default-value",
    section: "Basics",
    title: "defaultValue",
    options: { defaultValue: "hunter22" },
  },
  {
    id: "new-password",
    section: "Basics",
    title: "autoComplete new-password",
    note: "Password managers offer a strong new password.",
    options: { autoComplete: "new-password" },
  },
  {
    id: "disabled",
    section: "Basics",
    title: "disabled",
    options: { disabled: true },
  },
  {
    id: "read-only",
    section: "Basics",
    title: "readOnly",
    note: "The toggle still shows it.",
    options: { readOnly: true, defaultValue: "hunter22" },
  },
  {
    id: "rtl",
    section: "Basics",
    title: "Right to left",
    place: "rtl",
    options: { defaultValue: "שלום" },
  },
  {
    id: "form",
    section: "Form",
    title: "In a form",
    note: "Submit and reset hide it again.",
    form: true,
    options: { name: "password", required: true },
  },
  { id: "field", section: "Form", title: "In a Field", field: true },
  {
    id: "field-disabled",
    section: "Form",
    title: "In a disabled Field",
    field: true,
    options: { fieldDisabled: true },
  },
  {
    id: "controlled",
    section: "State",
    title: "Controlled visible",
    controlled: true,
  },
  { id: "controller", section: "State", title: "Controller", controller: true },
  { id: "cancel", section: "State", title: "Canceled changes", cancel: true },
  {
    id: "caps-lock",
    section: "State",
    title: "Caps Lock",
    note: "Turn Caps Lock on while typing.",
  },
  {
    id: "span-toggle",
    section: "Rendering",
    title: "Toggle as a span",
    render: "span",
  },
]

export { type Variant, variants }
