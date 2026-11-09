// Every scenario in the number input kitchen sink. Each framework renders the
// same list into the same shell, each field inside its own <form> with Save
// and Reset, so submission and reset can be tried on every variant.
type Variant = {
  id: string
  section: string
  title: string
  // NumberInput props that are plain values, so the web components take them as attributes.
  options?: Record<string, unknown>
  // A named `format`, since objects are properties on the web components.
  format?: keyof typeof formats
  // Where the field sits: a disabled fieldset, right to left, outside its form,
  // a transformed ancestor or a field with a label and description.
  place?: "fieldset" | "rtl" | "outside" | "transformed" | "field"
  // A scrub area before the group, with a cursor for when the pointer is locked.
  // `outside` puts it before the number input, connected through a controller
  // or, on the web, `for`.
  scrub?: {
    orientation?: "horizontal" | "vertical"
    pixelsPerStep?: number
    outside?: boolean
  }
  // Controlled by the card, with a button per preset value.
  controlled?: boolean
  // Buttons that drive it through a controller: a preset, increment, decrement and focus.
  controller?: boolean
  // Values the controlled and controller buttons set.
  presets?: (number | null)[]
}

const formats = {
  currency: { style: "currency", currency: "USD" },
  euro: { style: "currency", currency: "EUR" },
  pound: { style: "currency", currency: "EGP" },
  percent: { style: "percent" },
  unit: { style: "unit", unit: "kilogram" },
} satisfies Record<string, Intl.NumberFormatOptions>

const describe = (value: number | null) =>
  value === null ? "empty" : String(value)

const variants: Variant[] = [
  {
    id: "empty",
    section: "Values",
    title: "Empty at first",
    options: { name: "n" },
  },
  {
    id: "default",
    section: "Values",
    title: "Default value",
    options: { name: "n", defaultValue: 5 },
  },
  {
    id: "null",
    section: "Values",
    title: "Default value of null",
    options: { name: "n", defaultValue: null },
  },
  {
    id: "negative",
    section: "Values",
    title: "Negative numbers",
    options: { name: "n", min: -100, max: 100, defaultValue: -5 },
  },
  {
    id: "no-name",
    section: "Values",
    title: "No name, submits nothing",
    options: { defaultValue: 3 },
  },
  {
    id: "large",
    section: "Values",
    title: "Large number",
    options: { name: "n", defaultValue: 1234567.5, step: 0.5 },
  },

  {
    id: "min-max",
    section: "Range and step",
    title: "Min 0, max 10, at max",
    options: { name: "n", min: 0, max: 10, defaultValue: 10 },
  },
  {
    id: "at-min",
    section: "Range and step",
    title: "At min",
    options: { name: "n", min: 0, max: 10, defaultValue: 0 },
  },
  {
    id: "decimals",
    section: "Range and step",
    title: "Step 0.1",
    options: { name: "n", step: 0.1, defaultValue: 1.5 },
  },
  {
    id: "quarter",
    section: "Range and step",
    title: "Step 0.25",
    options: { name: "n", step: 0.25, defaultValue: 0.75 },
  },
  {
    id: "step-from-min",
    section: "Range and step",
    title: "Step 5 from min 3",
    options: { name: "n", min: 3, step: 5, defaultValue: 8 },
  },
  {
    id: "large-step",
    section: "Range and step",
    title: "Large step 25",
    options: { name: "n", largeStep: 25, defaultValue: 50 },
  },

  {
    id: "currency",
    section: "Format and locale",
    title: "Currency",
    options: { name: "n", defaultValue: 1234.5, step: 0.01 },
    format: "currency",
  },
  {
    id: "percent",
    section: "Format and locale",
    title: "Percent of a fraction",
    options: { name: "n", min: 0, max: 1, step: 0.01, defaultValue: 0.25 },
    format: "percent",
  },
  {
    id: "unit",
    section: "Format and locale",
    title: "Unit",
    options: { name: "n", min: 0, step: 0.5, defaultValue: 72.5 },
    format: "unit",
  },
  {
    id: "locale-de",
    section: "Format and locale",
    title: "German euros",
    options: { name: "n", locale: "de-DE", step: 0.01, defaultValue: 1234.56 },
    format: "euro",
  },
  {
    id: "locale-de-plain",
    section: "Format and locale",
    title: "German decimals",
    options: { name: "n", locale: "de-DE", step: 0.1, defaultValue: 1.5 },
  },
  {
    id: "locale-ar",
    section: "Format and locale",
    title: "Arabic digits, right to left",
    options: { name: "n", locale: "ar-EG", defaultValue: 1234 },
    place: "rtl",
  },
  {
    id: "locale-ar-currency",
    section: "Format and locale",
    title: "Egyptian pounds, right to left",
    options: { name: "n", locale: "ar-EG", step: 0.01, defaultValue: 99.5 },
    format: "pound",
    place: "rtl",
  },

  {
    id: "wheel",
    section: "States",
    title: "Mouse wheel steps it",
    options: { name: "n", wheel: true, defaultValue: 10 },
  },
  {
    id: "disabled",
    section: "States",
    title: "Disabled",
    options: { name: "n", disabled: true, defaultValue: 7 },
  },
  {
    id: "read-only",
    section: "States",
    title: "Read-only",
    options: { name: "n", readOnly: true, defaultValue: 7 },
  },
  {
    id: "required",
    section: "States",
    title: "Required, empty",
    options: { name: "n", required: true },
  },
  {
    id: "fieldset",
    section: "States",
    title: "In a disabled fieldset",
    options: { name: "n", defaultValue: 7 },
    place: "fieldset",
  },

  {
    id: "outside",
    section: "Forms and fields",
    title: "Outside its form",
    options: { name: "n", defaultValue: 4 },
    place: "outside",
  },
  {
    id: "field",
    section: "Forms and fields",
    title: "In a field",
    options: { defaultValue: 2, min: 1 },
    place: "field",
  },
  {
    id: "field-required",
    section: "Forms and fields",
    title: "Required in a field",
    options: { required: true, min: 1 },
    place: "field",
  },

  {
    id: "controlled",
    section: "Control",
    title: "Controlled",
    options: { name: "n", defaultValue: 5 },
    controlled: true,
    presets: [0, 42, null],
  },
  {
    id: "controller",
    section: "Control",
    title: "Controller",
    options: { name: "n", defaultValue: 5, max: 20 },
    controller: true,
    presets: [10, null],
  },

  {
    id: "scrub",
    section: "Scrub area",
    title: "Horizontal",
    options: { name: "n", defaultValue: 50 },
    scrub: {},
  },
  {
    id: "scrub-vertical",
    section: "Scrub area",
    title: "Vertical",
    options: { name: "n", defaultValue: 50 },
    scrub: { orientation: "vertical" },
  },
  {
    id: "scrub-slow",
    section: "Scrub area",
    title: "8 pixels per step",
    options: { name: "n", step: 0.1, defaultValue: 1 },
    scrub: { pixelsPerStep: 8 },
  },
  {
    id: "scrub-rtl",
    section: "Scrub area",
    title: "Right to left",
    options: { name: "n", defaultValue: 50 },
    scrub: {},
    place: "rtl",
  },
  {
    id: "scrub-transformed",
    section: "Scrub area",
    title: "Transformed ancestor",
    options: { name: "n", defaultValue: 50 },
    scrub: {},
    place: "transformed",
  },
  {
    id: "scrub-outside",
    section: "Scrub area",
    title: "Outside the number input",
    options: { name: "n", defaultValue: 50 },
    scrub: { outside: true },
  },
  {
    id: "scrub-disabled",
    section: "Scrub area",
    title: "Disabled",
    options: { name: "n", disabled: true, defaultValue: 50 },
    scrub: {},
  },

  {
    id: "rtl",
    section: "Containers",
    title: "Right to left",
    options: { name: "n", defaultValue: 12 },
    place: "rtl",
  },
  {
    id: "transformed",
    section: "Containers",
    title: "Transformed ancestor",
    options: { name: "n", defaultValue: 12 },
    place: "transformed",
  },
]

export { describe, formats, type Variant, variants }
