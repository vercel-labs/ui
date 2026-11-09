// Every scenario in the text field kitchen sink. Each framework renders the
// same list into the same shell. Each card holds a native form with a Submit
// and a Reset button, so every variant can be submitted and reset.
type Kind = "input" | "textarea" | "group" | "set"

type Variant = {
  id: string
  section: string
  title: string
  kind: Kind
  // Props for the Input or Textarea, or for the FieldSet.
  options?: Record<string, unknown>
  // A Field around the control, named "value".
  field?: boolean
  // The Field shows as invalid with this message, like an error from the server.
  invalid?: string
  // Changes that contain a digit are canceled.
  digitsCanceled?: boolean
  // Controlled by the card.
  controlled?: boolean
  // Buttons that drive the control through its controller.
  controller?: "input"
  // Where it sits: a right-to-left wrapper, or for a field set, inside a disabled native one.
  place?: "rtl" | "disabled-fieldset"
  // An InputGroup's addons: a prefix text, and a clear button.
  prefix?: string
  // The legend rendered as a div.
  legendAsDiv?: boolean
}

const variants: Variant[] = [
  {
    id: "input-default",
    section: "Input",
    title: "Default",
    kind: "input",
    field: true,
  },
  {
    id: "input-default-value",
    section: "Input",
    title: "Default value",
    kind: "input",
    field: true,
    options: { defaultValue: "Ada" },
  },
  {
    id: "input-controlled",
    section: "Input",
    title: "Controlled",
    kind: "input",
    field: true,
    controlled: true,
  },
  {
    id: "input-disabled",
    section: "Input",
    title: "Disabled",
    kind: "input",
    field: true,
    options: { disabled: true, defaultValue: "Ada" },
  },
  {
    id: "input-readonly",
    section: "Input",
    title: "Read-only",
    kind: "input",
    field: true,
    options: { readOnly: true, defaultValue: "Ada" },
  },
  {
    id: "input-required",
    section: "Input",
    title: "Required",
    kind: "input",
    field: true,
    options: { required: true },
  },
  {
    id: "input-email",
    section: "Input",
    title: "Email type",
    kind: "input",
    field: true,
    options: { type: "email", required: true },
  },
  {
    id: "input-digits",
    section: "Input",
    title: "Digits only (cancel)",
    kind: "input",
    field: true,
    digitsCanceled: true,
  },
  {
    id: "input-controller",
    section: "Input",
    title: "Controller",
    kind: "input",
    field: true,
    controller: "input",
  },
  {
    id: "input-debug",
    section: "Input",
    title: "Debug",
    kind: "input",
    field: true,
    options: { debug: true },
  },
  {
    id: "input-bare",
    section: "Input",
    title: "Without a field",
    kind: "input",
  },
  {
    id: "input-rtl",
    section: "Input",
    title: "Right to left",
    kind: "input",
    field: true,
    place: "rtl",
  },
  {
    id: "textarea-default",
    section: "Textarea",
    title: "Default",
    kind: "textarea",
    field: true,
  },
  {
    id: "textarea-auto",
    section: "Textarea",
    title: "Auto resize",
    kind: "textarea",
    field: true,
    options: { autoResize: true },
  },
  {
    id: "textarea-auto-value",
    section: "Textarea",
    title: "Auto resize with a long default",
    kind: "textarea",
    field: true,
    options: { autoResize: true, defaultValue: "One\nTwo\nThree\nFour" },
  },
  {
    id: "textarea-controlled",
    section: "Textarea",
    title: "Controlled, auto resize",
    kind: "textarea",
    field: true,
    controlled: true,
    options: { autoResize: true },
  },
  {
    id: "textarea-disabled",
    section: "Textarea",
    title: "Disabled",
    kind: "textarea",
    field: true,
    options: { disabled: true },
  },
  {
    id: "group-prefix",
    section: "Input group",
    title: "Prefix",
    kind: "group",
    field: true,
    prefix: "https://",
  },
  {
    id: "group-clear",
    section: "Input group",
    title: "Clear button",
    kind: "group",
    field: true,
    options: { defaultValue: "shoes" },
  },
  {
    id: "group-clear-controlled",
    section: "Input group",
    title: "Clear, controlled",
    kind: "group",
    field: true,
    controlled: true,
  },
  {
    id: "group-disabled",
    section: "Input group",
    title: "Disabled",
    kind: "group",
    field: true,
    options: { disabled: true, defaultValue: "shoes" },
  },
  {
    id: "group-readonly",
    section: "Input group",
    title: "Read-only",
    kind: "group",
    field: true,
    options: { readOnly: true, defaultValue: "shoes" },
  },
  {
    id: "group-rtl",
    section: "Input group",
    title: "Right to left",
    kind: "group",
    field: true,
    prefix: "https://",
    place: "rtl",
    options: { defaultValue: "shoes" },
  },
  {
    id: "field-set-default",
    section: "Field set",
    title: "Default",
    kind: "set",
  },
  {
    id: "field-set-disabled",
    section: "Field set",
    title: "Disabled",
    kind: "set",
    options: { disabled: true },
  },
  {
    id: "field-set-nested",
    section: "Field set",
    title: "Inside a disabled fieldset",
    kind: "set",
    place: "disabled-fieldset",
  },
  {
    id: "field-set-legend-div",
    section: "Field set",
    title: "Legend as a div",
    kind: "set",
    legendAsDiv: true,
  },
  {
    id: "field-invalid",
    section: "Field",
    title: "Invalid, from the page",
    kind: "input",
    field: true,
    invalid: "Taken.",
  },
  {
    id: "field-invalid-textarea",
    section: "Field",
    title: "Invalid textarea",
    kind: "textarea",
    field: true,
    invalid: "Too long. No links.",
  },
]

export { type Kind, type Variant, variants }
