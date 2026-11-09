// Every scenario in the kitchen sink. Each framework renders the same list.
type Variant = {
  id: string
  section: "Selection" | "Layout" | "Form" | "State" | "Rendering"
  title: string
  note?: string
  // Options passed as they are.
  options?: Record<string, unknown>
  // Which items: the plain list, groups, a long list, or object values from data.
  items?: "plain" | "grouped" | "long" | "objects"
  // Rendered from `items`, not composed.
  data?: boolean
  place?: "rtl"
  controlled?: boolean
  controller?: boolean
  // Cancels every value change from the change callback.
  cancel?: boolean
  // Inside a form with Submit and Reset buttons, which log.
  form?: boolean
  // Inside a Field, with a label and a description.
  field?: boolean
  // Items rendered as links.
  links?: boolean
}

const toppings = [
  { value: "basil", label: "Basil" },
  { value: "cheese", label: "Cheese" },
  { value: "garlic", label: "Garlic" },
  { value: "mushroom", label: "Mushroom" },
  { value: "olive", label: "Olive", disabled: true },
  { value: "onion", label: "Onion" },
  { value: "pepper", label: "Pepper" },
  { value: "tomato", label: "Tomato" },
]

const groups = [
  {
    label: "Herbs",
    items: toppings.filter((item) => ["basil", "garlic"].includes(item.value)),
  },
  {
    label: "Vegetables",
    items: toppings.filter((item) =>
      ["mushroom", "onion", "pepper"].includes(item.value)
    ),
  },
]

const plans = [
  { value: { id: "free", seats: 1 }, label: "Free" },
  { value: { id: "team", seats: 10 }, label: "Team" },
  { value: { id: "business", seats: 50 }, label: "Business" },
]

const longList = Array.from({ length: 500 }, (_, index) => ({
  value: `topping-${index + 1}`,
  label: `Topping ${index + 1}`,
}))

// The items of a variant, as data.
function variantData(variant: Variant) {
  if (variant.items === "long") {
    return longList
  }
  if (variant.items === "objects") {
    return plans
  }
  if (variant.items === "grouped") {
    return [
      {
        type: "group" as const,
        label: groups[0].label,
        items: groups[0].items,
      },
      { type: "separator" as const },
      {
        type: "group" as const,
        label: groups[1].label,
        items: groups[1].items,
      },
    ]
  }
  return toppings
}

// A value for the log: keys of object values, joined.
function describe(value: unknown) {
  const key = (item: unknown) =>
    typeof item === "object" && item !== null
      ? (item as { id: string }).id
      : String(item)
  return Array.isArray(value)
    ? `[${value.map(key).join(", ")}]`
    : value === null
      ? "null"
      : key(value)
}

const variants: Variant[] = [
  {
    id: "single",
    section: "Selection",
    title: "Single",
    note: "Selection follows focus.",
  },
  {
    id: "single-manual",
    section: "Selection",
    title: "Single, manual",
    note: "Arrows move focus. Space, Enter or a press selects.",
    options: { activation: "manual" },
  },
  {
    id: "deselectable",
    section: "Selection",
    title: "deselectable",
    options: { deselectable: true, defaultValue: "cheese" },
  },
  {
    id: "multiple",
    section: "Selection",
    title: "Multiple",
    note: "Space and presses toggle. Shift ranges, Ctrl or ⌘ with A selects all.",
    options: { multiple: true, defaultValue: ["basil", "onion"] },
  },
  {
    id: "multiple-automatic",
    section: "Selection",
    title: "Multiple, automatic",
    note: "A press or an arrow replaces. Ctrl or ⌘ adds. Taps toggle.",
    options: { multiple: true, activation: "automatic" },
  },
  {
    id: "no-loop",
    section: "Selection",
    title: "loop false",
    options: { loop: false },
  },
  {
    id: "grouped",
    section: "Layout",
    title: "Groups",
    items: "grouped",
    options: { multiple: true },
  },
  {
    id: "horizontal",
    section: "Layout",
    title: "Horizontal",
    options: { orientation: "horizontal" },
    items: "grouped",
  },
  {
    id: "horizontal-rtl",
    section: "Layout",
    title: "Horizontal, right to left",
    place: "rtl",
    options: { orientation: "horizontal" },
    items: "grouped",
  },
  {
    id: "long",
    section: "Layout",
    title: "500 items, scrolled to the selection",
    items: "long",
    data: true,
    options: { defaultValue: "topping-320" },
  },
  {
    id: "data",
    section: "Layout",
    title: "Data items",
    data: true,
    items: "grouped",
  },
  {
    id: "objects",
    section: "Layout",
    title: "Object values",
    note: "Each value is identified by its id.",
    data: true,
    items: "objects",
    options: { multiple: true, name: "plans" },
  },
  {
    id: "form",
    section: "Form",
    title: "In a form",
    note: "Submit and reset log what the form holds.",
    form: true,
    options: { name: "toppings", multiple: true, required: true },
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
    id: "disabled",
    section: "Form",
    title: "disabled",
    options: { disabled: true, defaultValue: "garlic" },
  },
  {
    id: "read-only",
    section: "Form",
    title: "readOnly",
    options: { readOnly: true, defaultValue: "garlic" },
  },
  {
    id: "controlled",
    section: "State",
    title: "Controlled value",
    controlled: true,
    options: { multiple: true },
  },
  {
    id: "controller",
    section: "State",
    title: "Controller",
    controller: true,
    options: { multiple: true },
  },
  { id: "cancel", section: "State", title: "Canceled changes", cancel: true },
  { id: "links", section: "Rendering", title: "Items as links", links: true },
]

export {
  describe,
  groups,
  longList,
  plans,
  toppings,
  type Variant,
  variantData,
  variants,
}
