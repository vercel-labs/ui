import type {
  NumberFormat,
  WaterfallBarLabelDetails,
  WaterfallDataItem,
} from "@ui-sdk/core/waterfall"
import { waterfallFixture } from "tests/fixtures/waterfall.ts"

// Every scenario in the waterfall kitchen sink. Each framework renders the same list.
type Variant = {
  id: string
  section: string
  title: string
  note?: string
  // Plain options, so the web components take them as attributes.
  options: {
    defaultExpanded?: string[]
    defaultValue?: string
    locale?: string
  }
  range?: [number, number]
  // A named `format`, since functions and objects are properties on the web components.
  format?: keyof typeof formats
  // A named `getBarLabel`.
  barLabel?: keyof typeof barLabels
  // A header row with the axis and a mark, and a status column. Without it, the default rows.
  columns?: boolean
  // Expand All, Collapse All and Reveal buttons on a controller.
  controller?: boolean
  place?: "rtl"
  // The `lang` of the page around it.
  lang?: string
  // How many rows show at first, which the smoke spec checks.
  rows: number
  // What the first row's bar says, which the smoke spec checks.
  bar?: string
}

const items = waterfallFixture.items

const formats = {
  seconds: (ms: number) => `${(ms / 1000).toFixed(2)} s`,
  narrow: { style: "unit", unit: "millisecond", unitDisplay: "narrow" },
} satisfies Record<string, NumberFormat>

const barLabels = {
  timing: (item: WaterfallDataItem, details: WaterfallBarLabelDetails) =>
    `${item.label} took ${details.duration}`,
} satisfies Record<
  string,
  (item: WaterfallDataItem, details: WaterfallBarLabelDetails) => string
>

// What the props chips show.
function chipsOf(variant: Variant) {
  return {
    ...variant.options,
    ...(variant.range && { range: variant.range }),
    ...(variant.format && { format: variant.format }),
    ...(variant.barLabel && { getBarLabel: variant.barLabel }),
    ...(variant.columns && { columns: true }),
    ...(variant.controller && { controller: true }),
    ...(variant.lang && { lang: variant.lang }),
  }
}

const variants: Variant[] = [
  {
    id: "default-rows",
    section: "Rows",
    title: "No children",
    note: "A row with a header and a bar for every span.",
    options: {},
    rows: 2,
    bar: "GET /, starts at 0 ms, lasts 1 sec",
  },
  {
    id: "columns",
    section: "Rows",
    title: "Columns, axis and mark",
    options: {},
    columns: true,
    rows: 2,
  },
  {
    id: "expanded",
    section: "Rows",
    title: "defaultExpanded",
    options: { defaultExpanded: ["document", "script"] },
    columns: true,
    rows: 6,
  },
  {
    id: "selected",
    section: "Rows",
    title: "defaultValue",
    note: "The selected row holds the tab stop.",
    options: { defaultExpanded: ["document", "script"], defaultValue: "user" },
    columns: true,
    rows: 6,
  },
  {
    id: "controller",
    section: "Rows",
    title: "Controller",
    note: "Expand All, Collapse All and Reveal call the controller.",
    options: {},
    columns: true,
    controller: true,
    rows: 2,
  },

  {
    id: "range",
    section: "Time axis",
    title: "range={[500, 1000]}",
    note: "Zoomed in: bars outside the range shrink to its edges.",
    options: { defaultExpanded: ["document", "script"] },
    range: [500, 1000],
    columns: true,
    rows: 6,
  },
  {
    id: "format-function",
    section: "Time axis",
    title: "format as a function",
    options: {},
    format: "seconds",
    rows: 2,
    bar: "GET /, starts at 0.00 s, lasts 1.00 s",
  },
  {
    id: "format-options",
    section: "Time axis",
    title: "format as Intl options",
    options: {},
    format: "narrow",
    rows: 2,
    bar: "GET /, starts at 0ms, lasts 1,000ms",
  },
  {
    id: "bar-label",
    section: "Time axis",
    title: "getBarLabel",
    options: {},
    barLabel: "timing",
    rows: 2,
    bar: "GET / took 1 sec",
  },
  {
    id: "locale",
    section: "Time axis",
    title: 'locale="de-DE"',
    options: { locale: "de-DE" },
    rows: 2,
    bar: "GET /, starts at 0 ms, lasts 1 Sek.",
  },
  {
    id: "page-lang",
    section: "Time axis",
    title: 'Inside lang="fr"',
    note: "Without a locale, the page's language formats it.",
    options: {},
    lang: "fr",
    rows: 2,
    bar: "GET /, starts at 0 ms, lasts 1 s",
  },
  {
    id: "rtl",
    section: "Time axis",
    title: "Right to left",
    note: "Bars run from the right, and Left expands.",
    options: { defaultExpanded: ["document"] },
    columns: true,
    place: "rtl",
    rows: 4,
  },
]

export { barLabels, chipsOf, formats, items, type Variant, variants }
