// Every scenario in the slider kitchen sink. Each framework renders the same
// list into the same shell, each slider inside its own <form> with Save and
// Reset, so submission and reset can be tried on every variant.
type Variant = {
  id: string
  section: string
  title: string
  // Slider props that are plain values, so the web components take them as attributes.
  options?: Record<string, unknown>
  // A named `format`, since functions and objects are properties on the web components.
  format?: keyof typeof formats
  // Where the slider sits: a disabled fieldset, right to left, outside its form,
  // a transformed ancestor or a field with a label and description.
  place?: "fieldset" | "rtl" | "outside" | "transformed" | "field"
  // Controlled by the card, with a button per preset value.
  controlled?: boolean
  // Buttons that drive it through a controller: one per preset value, then focus.
  controller?: boolean
  // Values the controlled and controller buttons set.
  presets?: (number | number[])[]
  // `SliderValue` with its own content, and each thumb showing its value.
  custom?: boolean
}

const formats = {
  currency: { style: "currency", currency: "USD", maximumFractionDigits: 0 },
  euro: { style: "currency", currency: "EUR" },
  percent: { style: "percent" },
  unit: { style: "unit", unit: "celsius" },
  stars: (value: number) => `${value} of 5 stars`,
} satisfies Record<
  string,
  Intl.NumberFormatOptions | ((value: number) => string)
>

// The thumbs a variant renders, one per value.
function thumbsOf(variant: Variant) {
  const value = variant.options?.value ?? variant.options?.defaultValue
  return Array.isArray(value) ? value.length : 1
}

// Accessible names for the thumbs. A field names a single thumb itself.
function thumbLabel(variant: Variant, index: number) {
  const count = thumbsOf(variant)
  if (count === 1) {
    return variant.place === "field" ? undefined : "Volume"
  }
  if (count === 2) {
    return ["Minimum", "Maximum"][index]
  }
  return `Stop ${index + 1}`
}

// What a value reads as on a button.
const describe = (value: number | number[]) =>
  Array.isArray(value) ? value.join("–") : String(value)

const variants: Variant[] = [
  {
    id: "single",
    section: "Values",
    title: "Single thumb",
    options: { name: "v", defaultValue: 50 },
  },
  {
    id: "single-empty",
    section: "Values",
    title: "No default, starts at min",
    options: { name: "v" },
  },
  {
    id: "range",
    section: "Values",
    title: "Range",
    options: { name: "r", defaultValue: [20, 80] },
  },
  {
    id: "three",
    section: "Values",
    title: "Three thumbs",
    options: { name: "t", defaultValue: [10, 40, 70] },
  },
  {
    id: "no-name",
    section: "Values",
    title: "No name, submits nothing",
    options: { defaultValue: 30 },
  },
  {
    id: "custom",
    section: "Values",
    title: "Custom value and thumb content",
    options: { name: "v", defaultValue: [25, 75] },
    custom: true,
  },

  {
    id: "min-max",
    section: "Range and step",
    title: "Negative min",
    options: { name: "v", min: -50, max: 50, defaultValue: 0 },
  },
  {
    id: "step",
    section: "Range and step",
    title: "Step of 5",
    options: { name: "v", step: 5, defaultValue: 25 },
  },
  {
    id: "decimals",
    section: "Range and step",
    title: "Decimal step",
    options: { name: "v", min: 0, max: 1, step: 0.01, defaultValue: 0.35 },
  },
  {
    id: "off-grid",
    section: "Range and step",
    title: "Max off the step grid",
    options: { name: "v", min: 0, max: 100, step: 3, defaultValue: 96 },
  },
  {
    id: "large-step",
    section: "Range and step",
    title: "Large step of 25",
    options: { name: "v", largeStep: 25, defaultValue: 50 },
  },
  {
    id: "min-steps",
    section: "Range and step",
    title: "Thumbs 10 steps apart",
    options: { name: "r", minStepsBetweenThumbs: 10, defaultValue: [30, 45] },
  },
  {
    id: "min-steps-three",
    section: "Range and step",
    title: "Three thumbs, step 5, 2 steps apart",
    options: {
      name: "t",
      step: 5,
      minStepsBetweenThumbs: 2,
      defaultValue: [20, 50, 80],
    },
  },
  {
    id: "touching",
    section: "Range and step",
    title: "Thumbs on the same value",
    options: { name: "r", defaultValue: [50, 50] },
  },

  {
    id: "vertical",
    section: "Orientation and direction",
    title: "Vertical",
    options: { name: "v", orientation: "vertical", defaultValue: 40 },
  },
  {
    id: "vertical-range",
    section: "Orientation and direction",
    title: "Vertical range",
    options: { name: "r", orientation: "vertical", defaultValue: [20, 60] },
  },
  {
    id: "rtl",
    section: "Orientation and direction",
    title: "Right to left",
    options: { name: "v", defaultValue: 30 },
    place: "rtl",
  },
  {
    id: "rtl-range",
    section: "Orientation and direction",
    title: "Right to left range",
    options: { name: "r", defaultValue: [20, 70] },
    place: "rtl",
  },
  {
    id: "vertical-rtl",
    section: "Orientation and direction",
    title: "Vertical, right to left",
    options: { name: "v", orientation: "vertical", defaultValue: 70 },
    place: "rtl",
  },

  {
    id: "currency",
    section: "Format and locale",
    title: "Currency",
    options: { name: "v", max: 1000, step: 10, defaultValue: 250 },
    format: "currency",
  },
  {
    id: "currency-range",
    section: "Format and locale",
    title: "Currency range",
    options: { name: "r", max: 1000, step: 10, defaultValue: [200, 800] },
    format: "currency",
  },
  {
    id: "percent",
    section: "Format and locale",
    title: "Percent of a fraction",
    options: { name: "v", min: 0, max: 1, step: 0.01, defaultValue: 0.4 },
    format: "percent",
  },
  {
    id: "unit",
    section: "Format and locale",
    title: "Unit",
    options: { name: "v", min: -10, max: 40, defaultValue: 21 },
    format: "unit",
  },
  {
    id: "function",
    section: "Format and locale",
    title: "Format function",
    options: { name: "v", min: 0, max: 5, step: 0.5, defaultValue: 3.5 },
    format: "stars",
  },
  {
    id: "locale-de",
    section: "Format and locale",
    title: "German locale",
    options: {
      name: "v",
      locale: "de-DE",
      max: 5000,
      step: 0.5,
      defaultValue: 1234.5,
    },
    format: "euro",
  },
  {
    id: "locale-de-plain",
    section: "Format and locale",
    title: "German decimals, no format",
    options: {
      name: "v",
      locale: "de-DE",
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0.25,
    },
  },
  {
    id: "locale-ar",
    section: "Format and locale",
    title: "Arabic digits, right to left",
    options: { name: "v", locale: "ar-EG", defaultValue: 42 },
    place: "rtl",
  },

  {
    id: "disabled",
    section: "States",
    title: "Disabled",
    options: { name: "v", disabled: true, defaultValue: 60 },
  },
  {
    id: "disabled-range",
    section: "States",
    title: "Disabled range",
    options: { name: "r", disabled: true, defaultValue: [20, 60] },
  },
  {
    id: "fieldset",
    section: "States",
    title: "In a disabled fieldset",
    options: { name: "v", defaultValue: 60 },
    place: "fieldset",
  },

  {
    id: "outside",
    section: "Forms and fields",
    title: "Outside its form",
    options: { name: "v", defaultValue: 50 },
    place: "outside",
  },
  {
    id: "field",
    section: "Forms and fields",
    title: "In a field",
    options: { defaultValue: 50 },
    place: "field",
  },
  {
    id: "field-range",
    section: "Forms and fields",
    title: "Range in a field",
    options: { defaultValue: [20, 80] },
    place: "field",
  },

  {
    id: "controlled",
    section: "Control",
    title: "Controlled",
    options: { name: "v", defaultValue: 50 },
    controlled: true,
    presets: [25, 75],
  },
  {
    id: "controlled-range",
    section: "Control",
    title: "Controlled range",
    options: { name: "r", defaultValue: [20, 80] },
    controlled: true,
    presets: [
      [10, 40],
      [60, 90],
    ],
  },
  {
    id: "controller",
    section: "Control",
    title: "Controller",
    options: { name: "v", defaultValue: 50 },
    controller: true,
    presets: [0, 100],
  },
  {
    id: "controller-range",
    section: "Control",
    title: "Controller on a range",
    options: { name: "r", defaultValue: [20, 80] },
    controller: true,
    presets: [
      [10, 90],
      [45, 55],
    ],
  },

  {
    id: "transformed",
    section: "Containers",
    title: "Transformed ancestor",
    options: { name: "v", defaultValue: 50 },
    place: "transformed",
  },
  {
    id: "transformed-vertical",
    section: "Containers",
    title: "Vertical in a transformed ancestor",
    options: { name: "r", orientation: "vertical", defaultValue: [30, 70] },
    place: "transformed",
  },
]

export { describe, formats, thumbLabel, thumbsOf, type Variant, variants }
