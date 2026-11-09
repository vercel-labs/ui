// Every scenario in the form controls kitchen sink. Each framework renders the
// same list into the same shell, each control inside its own <form> with Submit
// and Reset, so submission, reset and validation can be tried on every variant.
type Kind = "checkbox" | "switch" | "radio" | "checkbox-group" | "field"

type Variant = {
  id: string
  section: string
  title: string
  kind: Kind
  // Props for the control: Checkbox, Switch, RadioGroup or CheckboxGroup.
  options?: Record<string, unknown>
  // Options for a Field around the control. A field holds an email input when `kind` is "field".
  field?: {
    invalid?: boolean
    disabled?: boolean
  }
  // Radio and checkbox group items. The third entry marks an item disabled.
  items?: [value: string, label: string, disabled?: boolean][]
  // A select-all checkbox in a checkbox group.
  parent?: boolean
  // Renders the indicator kept mounted, or animated.
  indicator?: "kept" | "animated"
  // Where the control sits: a disabled fieldset, a right-to-left wrapper, outside its form.
  place?: "fieldset" | "rtl" | "outside"
  // Controlled by the card, which shows the value and offers buttons to change it.
  controlled?: boolean
  // A button that drives it through a controller.
  controller?: boolean
}

const plans: Variant["items"] = [
  ["free", "Free"],
  ["pro", "Pro"],
  ["team", "Team", true],
  ["enterprise", "Enterprise"],
]
const toppings: Variant["items"] = [
  ["cheese", "Cheese"],
  ["mushrooms", "Mushrooms"],
  ["olives", "Olives", true],
]

const variants: Variant[] = [
  {
    id: "checkbox-default",
    section: "Checkbox",
    title: "Default",
    kind: "checkbox",
    options: { name: "a" },
  },
  {
    id: "checkbox-checked",
    section: "Checkbox",
    title: "Checked at first",
    kind: "checkbox",
    options: { name: "a", defaultChecked: true },
  },
  {
    id: "checkbox-mixed",
    section: "Checkbox",
    title: "Indeterminate",
    kind: "checkbox",
    options: { name: "a", defaultChecked: "indeterminate" },
  },
  {
    id: "checkbox-disabled",
    section: "Checkbox",
    title: "Disabled",
    kind: "checkbox",
    options: { name: "a", disabled: true, defaultChecked: true },
  },
  {
    id: "checkbox-readonly",
    section: "Checkbox",
    title: "Read-only",
    kind: "checkbox",
    options: { name: "a", readOnly: true, defaultChecked: true },
  },
  {
    id: "checkbox-required",
    section: "Checkbox",
    title: "Required",
    kind: "checkbox",
    options: { name: "a", required: true },
  },
  {
    id: "checkbox-value",
    section: "Checkbox",
    title: "Name and value",
    kind: "checkbox",
    options: { name: "plan", value: "yearly" },
  },
  {
    id: "checkbox-outside",
    section: "Checkbox",
    title: "Outside its form",
    kind: "checkbox",
    options: { name: "a" },
    place: "outside",
  },
  {
    id: "checkbox-fieldset",
    section: "Checkbox",
    title: "In a disabled fieldset",
    kind: "checkbox",
    options: { name: "a" },
    place: "fieldset",
  },
  {
    id: "checkbox-rtl",
    section: "Checkbox",
    title: "Right to left",
    kind: "checkbox",
    options: { name: "a" },
    place: "rtl",
  },
  {
    id: "checkbox-kept",
    section: "Checkbox",
    title: "Indicator kept mounted",
    kind: "checkbox",
    options: { name: "a" },
    indicator: "kept",
  },
  {
    id: "checkbox-animated",
    section: "Checkbox",
    title: "Animated indicator",
    kind: "checkbox",
    options: { name: "a" },
    indicator: "animated",
  },
  {
    id: "checkbox-controlled",
    section: "Checkbox",
    title: "Controlled",
    kind: "checkbox",
    options: { name: "a" },
    controlled: true,
  },
  {
    id: "checkbox-controller",
    section: "Checkbox",
    title: "Controller",
    kind: "checkbox",
    options: { name: "a" },
    controller: true,
  },

  {
    id: "switch-default",
    section: "Switch",
    title: "Default",
    kind: "switch",
    options: { name: "s" },
  },
  {
    id: "switch-checked",
    section: "Switch",
    title: "On at first",
    kind: "switch",
    options: { name: "s", defaultChecked: true },
  },
  {
    id: "switch-disabled",
    section: "Switch",
    title: "Disabled",
    kind: "switch",
    options: { name: "s", disabled: true },
  },
  {
    id: "switch-readonly",
    section: "Switch",
    title: "Read-only",
    kind: "switch",
    options: { name: "s", readOnly: true, defaultChecked: true },
  },
  {
    id: "switch-required",
    section: "Switch",
    title: "Required",
    kind: "switch",
    options: { name: "s", required: true },
  },
  {
    id: "switch-rtl",
    section: "Switch",
    title: "Right to left",
    kind: "switch",
    options: { name: "s" },
    place: "rtl",
  },
  {
    id: "switch-controlled",
    section: "Switch",
    title: "Controlled",
    kind: "switch",
    options: { name: "s" },
    controlled: true,
  },

  {
    id: "radio-default",
    section: "Radio group",
    title: "Nothing checked",
    kind: "radio",
    options: { name: "plan" },
    items: plans,
  },
  {
    id: "radio-value",
    section: "Radio group",
    title: "Default value",
    kind: "radio",
    options: { name: "plan", defaultValue: "pro" },
    items: plans,
  },
  {
    id: "radio-disabled",
    section: "Radio group",
    title: "Disabled group",
    kind: "radio",
    options: { name: "plan", disabled: true, defaultValue: "pro" },
    items: plans,
  },
  {
    id: "radio-readonly",
    section: "Radio group",
    title: "Read-only",
    kind: "radio",
    options: { name: "plan", readOnly: true, defaultValue: "pro" },
    items: plans,
  },
  {
    id: "radio-required",
    section: "Radio group",
    title: "Required",
    kind: "radio",
    options: { name: "plan", required: true },
    items: plans,
  },
  {
    id: "radio-no-loop",
    section: "Radio group",
    title: "No loop",
    kind: "radio",
    options: { name: "plan", loop: false, defaultValue: "free" },
    items: plans,
  },
  {
    id: "radio-rtl",
    section: "Radio group",
    title: "Right to left",
    kind: "radio",
    options: { name: "plan", defaultValue: "free" },
    items: plans,
    place: "rtl",
  },
  {
    id: "radio-fieldset",
    section: "Radio group",
    title: "In a disabled fieldset",
    kind: "radio",
    options: { name: "plan" },
    items: plans,
    place: "fieldset",
  },
  {
    id: "radio-kept",
    section: "Radio group",
    title: "Indicators kept mounted",
    kind: "radio",
    options: { name: "plan" },
    items: plans,
    indicator: "kept",
  },
  {
    id: "radio-controlled",
    section: "Radio group",
    title: "Controlled",
    kind: "radio",
    options: { name: "plan" },
    items: plans,
    controlled: true,
  },
  {
    id: "radio-controller",
    section: "Radio group",
    title: "Controller",
    kind: "radio",
    options: { name: "plan" },
    items: plans,
    controller: true,
  },

  {
    id: "group-default",
    section: "Checkbox group",
    title: "Default value",
    kind: "checkbox-group",
    options: { name: "t", defaultValue: ["cheese"] },
    items: toppings,
  },
  {
    id: "group-parent",
    section: "Checkbox group",
    title: "Parent with all values",
    kind: "checkbox-group",
    options: {
      name: "t",
      defaultValue: ["cheese"],
      allValues: ["cheese", "mushrooms", "olives"],
    },
    items: toppings,
    parent: true,
  },
  {
    id: "group-parent-found",
    section: "Checkbox group",
    title: "Parent finding its checkboxes",
    kind: "checkbox-group",
    options: { name: "t" },
    items: toppings,
    parent: true,
  },
  {
    id: "group-disabled",
    section: "Checkbox group",
    title: "Disabled",
    kind: "checkbox-group",
    options: { name: "t", disabled: true, defaultValue: ["cheese"] },
    items: toppings,
  },
  {
    id: "group-required",
    section: "Checkbox group",
    title: "Required",
    kind: "checkbox-group",
    options: { name: "t", required: true },
    items: toppings,
  },
  {
    id: "group-controlled",
    section: "Checkbox group",
    title: "Controlled",
    kind: "checkbox-group",
    options: { name: "t" },
    items: toppings,
    parent: true,
    controlled: true,
  },

  {
    id: "field-submit",
    section: "Field",
    title: "Errors on submit",
    kind: "field",
    field: {},
  },
  {
    id: "field-invalid",
    section: "Field",
    title: "Marked invalid",
    kind: "field",
    field: { invalid: true },
  },
  {
    id: "field-not-invalid",
    section: "Field",
    title: "Marked not invalid",
    kind: "field",
    field: { invalid: false },
  },
  {
    id: "field-disabled",
    section: "Field",
    title: "Disabled",
    kind: "field",
    field: { disabled: true },
  },
  {
    id: "field-checkbox",
    section: "Field",
    title: "Around a checkbox",
    kind: "checkbox",
    options: { name: "terms", required: true },
    field: {},
  },
  {
    id: "field-radio",
    section: "Field",
    title: "Around a radio group",
    kind: "radio",
    options: { name: "plan", required: true },
    items: plans,
    field: {},
  },
  {
    id: "field-group",
    section: "Field",
    title: "Around a checkbox group",
    kind: "checkbox-group",
    options: { name: "t", required: true },
    items: toppings,
    field: {},
  },
]

export { type Kind, type Variant, variants }
