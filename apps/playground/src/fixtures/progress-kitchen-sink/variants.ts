import type { GaugeLabelDetails, NumberFormat } from "@ui-sdk/core/progress"

// Every scenario in the progress kitchen sink. Each framework renders the same list.
type Variant = {
  id: string
  section: string
  title: string
  note?: string
  // What the Label part says.
  label: string
  // Plain options, so the web components take them as attributes. A null value is indeterminate.
  options: {
    value: number | null
    min?: number
    max?: number
    locale?: string
  }
  // A named `format`, since functions and objects are properties on the web components.
  format?: keyof typeof formats
  // A named `getValueLabel`.
  valueLabel?: keyof typeof valueLabels
  place?: "rtl"
  // The `lang` of the page around it.
  lang?: string
  // Buttons that move the value, with the indicator animating to it.
  steps?: boolean
  // The Value part's content as a function of its state, in React and Vue.
  render?: boolean
  // What the Value part reads, with spaces normalized, which the smoke spec checks.
  text?: string
}

const formats = {
  percentDecimals: { style: "percent", minimumFractionDigits: 1 },
  dollars: { style: "currency", currency: "USD" },
  euros: { style: "currency", currency: "EUR" },
  megabytes: { style: "unit", unit: "megabyte" },
  gigabytes: { style: "unit", unit: "gigabyte" },
  files: (value: number) => `${value} of 12 files`,
} satisfies Record<string, NumberFormat>

const valueLabels = {
  files: (value: number | null, details: GaugeLabelDetails) =>
    value === null ? "Waiting for files" : `${value} of ${details.max} files`,
} satisfies Record<
  string,
  (value: number | null, details: GaugeLabelDetails) => string
>

// What the step buttons set the value to, from the current one.
const progressSteps: [string, (value: number | null) => number | null][] = [
  ["advance +20", (value) => Math.min(100, (value ?? 0) + 20)],
  ["restart", () => 0],
  ["indeterminate", () => null],
  ["complete", () => 100],
]

// What the props chips show.
function chipsOf(variant: Variant) {
  return {
    ...variant.options,
    ...(variant.format && { format: variant.format }),
    ...(variant.valueLabel && { getValueLabel: variant.valueLabel }),
    ...(variant.lang && { lang: variant.lang }),
    ...(variant.render && { render: true }),
  }
}

const variants: Variant[] = [
  {
    id: "progress-0",
    section: "Progress",
    title: "value={0}",
    label: "Uploading",
    options: { value: 0 },
    text: "0%",
  },
  {
    id: "progress-40",
    section: "Progress",
    title: "value={40}",
    label: "Uploading",
    options: { value: 40 },
    text: "40%",
  },
  {
    id: "progress-100",
    section: "Progress",
    title: "value={100}",
    note: "Complete: the bar turns green.",
    label: "Uploaded",
    options: { value: 100 },
    text: "100%",
  },
  {
    id: "progress-indeterminate",
    section: "Progress",
    title: "Indeterminate",
    note: "No value: under way, how far unknown.",
    label: "Loading",
    options: { value: null },
    text: "",
  },
  {
    id: "progress-min-max",
    section: "Progress",
    title: "min={50} max={150}",
    label: "Range",
    options: { value: 100, min: 50, max: 150 },
    text: "50%",
  },
  {
    id: "progress-above-max",
    section: "Progress",
    title: "Value above max",
    note: "140 of 100 reads as complete.",
    label: "Overshoot",
    options: { value: 140 },
    text: "100%",
  },
  {
    id: "progress-below-min",
    section: "Progress",
    title: "Value below min",
    label: "Undershoot",
    options: { value: -20 },
    text: "0%",
  },
  {
    id: "progress-max-below-min",
    section: "Progress",
    title: "max below min",
    note: "max becomes min.",
    label: "Inverted",
    options: { value: 7, min: 10, max: 5 },
    text: "0%",
  },

  {
    id: "format-percent-decimals",
    section: "Progress format",
    title: "Percent with a decimal",
    label: "Exported",
    options: { value: 33.333 },
    format: "percentDecimals",
    text: "33.3%",
  },
  {
    id: "format-currency",
    section: "Progress format",
    title: "Currency",
    note: "Any style but percent shows the value itself.",
    label: "Raised",
    options: { value: 40, max: 120 },
    format: "dollars",
    text: "$40.00",
  },
  {
    id: "format-unit",
    section: "Progress format",
    title: "Unit",
    label: "Downloaded",
    options: { value: 64, max: 256 },
    format: "megabytes",
    text: "64 MB",
  },
  {
    id: "format-function",
    section: "Progress format",
    title: "Function",
    label: "Files",
    options: { value: 3, max: 12 },
    format: "files",
    text: "3 of 12 files",
  },
  {
    id: "format-locale",
    section: "Progress format",
    title: 'locale="de-DE"',
    label: "Hochgeladen",
    options: { value: 40, locale: "de-DE" },
    text: "40 %",
  },
  {
    id: "format-locale-currency",
    section: "Progress format",
    title: 'locale="de-DE" with euros',
    label: "Gesammelt",
    options: { value: 1234.5, max: 5000, locale: "de-DE" },
    format: "euros",
    text: "1.234,50 €",
  },
  {
    id: "format-page-lang",
    section: "Progress format",
    title: 'Inside lang="fr"',
    note: "Without a locale, the page's language formats it.",
    label: "Téléversé",
    options: { value: 40 },
    lang: "fr",
    text: "40 %",
  },
  {
    id: "format-value-label",
    section: "Progress format",
    title: "getValueLabel",
    note: "Screen readers hear “3 of 12 files”.",
    label: "Files",
    options: { value: 3, max: 12 },
    valueLabel: "files",
    text: "25%",
  },
  {
    id: "format-value-label-indeterminate",
    section: "Progress format",
    title: "getValueLabel while indeterminate",
    note: "Screen readers hear “Waiting for files”.",
    label: "Files",
    options: { value: null, max: 12 },
    valueLabel: "files",
    text: "",
  },

  {
    id: "progress-steps",
    section: "Progress behavior",
    title: "Animated",
    note: "The indicator eases to each new value.",
    label: "Uploading",
    options: { value: 0 },
    steps: true,
    text: "0%",
  },
  {
    id: "progress-rtl",
    section: "Progress behavior",
    title: "Right to left",
    note: "Fills from the right.",
    label: "Uploading",
    options: { value: 30 },
    place: "rtl",
    text: "30%",
  },
  {
    id: "progress-render",
    section: "Progress behavior",
    title: "Value from state",
    note: "React and Vue. Shows the status after the value.",
    label: "Uploading",
    options: { value: 60 },
    render: true,
  },
]

export { chipsOf, formats, progressSteps, valueLabels, type Variant, variants }
