import type { ListItem, ListData } from "@ui-sdk/core/combobox"
import type { Animation } from "./classes"

// Every scenario in the kitchen sink. Each framework renders the same list.
type Variant = {
  id: string
  section: string
  title: string
  note?: string
  // Which items the combobox holds.
  list?: List
  // Composition renders ComboboxItem parts in a ComboboxList. Data passes `items` and renders the
  // parts from the list's state.
  mode?: "composition" | "data"
  options?: {
    multiple?: boolean
    maxSelected?: number
    defaultValue?: string | string[]
    defaultQuery?: string
    filter?: "contains" | "startsWith" | false | "function"
    autoHighlight?: boolean
    keepQuery?: boolean
    allowCustomValue?: boolean
    modal?: boolean | "pointer"
    loop?: boolean
    disabled?: boolean
    readOnly?: boolean
    required?: boolean
    name?: string
    debug?: boolean
  }
  content?: {
    side?: "top" | "right" | "bottom" | "left"
    align?: "start" | "center" | "end"
    sideOffset?: number
    alignOffset?: number
    collisionPadding?: number
  }
  // Chips around the input, one per value, for `multiple`.
  chips?: boolean
  // A ComboboxTrigger button beside the input.
  trigger?: boolean
  // A ComboboxClear button, shown while there's something to clear, or always.
  clear?: "auto" | "keep-mounted"
  // ComboboxItemIndicator's `keepMounted`.
  indicatorKeepMounted?: boolean
  // A ComboboxCreate option. Async waits before it resolves, so `data-pending` shows. Reject fails.
  create?: "sync" | "async" | "reject"
  // Results from a fake server, with `filter={false}`, `status`, ComboboxStatus and ComboboxEmpty. Error always
  // fails. Pages answers five at a time and loads the next when the end of the list is reached.
  async?: "ok" | "error" | "pages"
  // Recent countries while the input is empty.
  recent?: boolean
  // A select-all option at the top of the list.
  selectAll?: boolean
  // Chips stay on one line and collapse into "+N more".
  overflow?: boolean
  // ComboboxValue's `max`, shown beside the combobox.
  max?: number
  arrow?: boolean
  // Wraps the combobox in a form with Submit and Reset.
  form?: boolean
  animation?: Animation
  // Where the input sits.
  place?:
    | "card"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "scroll"
    | "clip"
    | "transform"
    | "rtl"
  portal?: boolean
  controlled?: "value" | "open" | "query"
  controller?: boolean
}

type List = "countries" | "grouped" | "many" | "objects"

type Country = { code: string; name: string }

const countries: ListItem[] = [
  { value: "ar", label: "Argentina" },
  { value: "au", label: "Australia" },
  { value: "at", label: "Austria" },
  { value: "br", label: "Brazil" },
  { value: "ca", label: "Canada" },
  { value: "dk", label: "Denmark", disabled: true },
  { value: "fr", label: "France" },
  { value: "de", label: "Germany", keywords: ["deutschland"] },
  { value: "jp", label: "Japan", keywords: ["nippon"] },
  { value: "nl", label: "Netherlands", keywords: ["holland"] },
  { value: "gb", label: "United Kingdom", keywords: ["uk", "britain"] },
  { value: "us", label: "United States", keywords: ["usa", "america"] },
]

const grouped: ListData = [
  {
    type: "group",
    label: "Americas",
    items: [
      { value: "ar", label: "Argentina" },
      { value: "br", label: "Brazil" },
      { value: "ca", label: "Canada" },
    ],
  },
  { type: "separator" },
  {
    type: "group",
    label: "Europe",
    items: [
      { value: "at", label: "Austria" },
      { value: "dk", label: "Denmark", disabled: true },
      { value: "fr", label: "France" },
    ],
  },
  { type: "separator" },
  {
    type: "group",
    label: "Asia",
    items: [
      { value: "jp", label: "Japan" },
      { value: "kr", label: "South Korea" },
    ],
  },
]

const many: ListData = Array.from({ length: 1000 }, (_, index) => ({
  value: `item-${index + 1}`,
  label: `Item ${index + 1}`,
}))

const objects: Country[] = [
  { code: "ar", name: "Argentina" },
  { code: "br", name: "Brazil" },
  { code: "ca", name: "Canada" },
  { code: "fr", name: "France" },
  { code: "jp", name: "Japan" },
  { code: "ke", name: "Kenya" },
]

// Object values. `itemToValue` names them in forms and keys, `itemToLabel` shows them.
const objectOptions = {
  itemToValue: (country: Country) => country.code,
  itemToLabel: (country: Country) => country.name,
}

function listOf(variant: Variant) {
  switch (variant.list) {
    case "grouped":
      return grouped
    case "many":
      return many
    case "objects":
      return objects.map((country) => ({ value: country, label: country.name }))
    default:
      return countries
  }
}

// The value at first. Objects are looked up by their code.
function defaultValueOf(variant: Variant) {
  const value = variant.options?.defaultValue
  if (variant.list !== "objects" || value === undefined) {
    return value
  }
  const find = (code: string) =>
    objects.find((country) => country.code === code)
  return Array.isArray(value) ? value.map(find) : find(value)
}

// The value the "Set" buttons choose.
function sampleValue(variant: Variant) {
  if (variant.options?.multiple) {
    return ["fr", "jp"]
  }
  if (variant.list === "objects") {
    return objects[3]
  }
  return "fr"
}

// Matches when the text's letters appear in order, like "brz" for Brazil.
function fuzzy(item: ListItem<any>, query: string) {
  const label = item.label.toLowerCase()
  let from = 0
  for (const char of query.toLowerCase()) {
    from = label.indexOf(char, from) + 1
    if (!from) {
      return false
    }
  }
  return true
}

// The filter option, with "function" standing for `fuzzy`.
function filterOf(variant: Variant) {
  const filter = variant.options?.filter
  return filter === "function" ? fuzzy : filter
}

const wait = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener("abort", () => {
      clearTimeout(timer)
      reject(signal.reason)
    })
  })

// A fake server: countries matching the text, after 600ms. "error" always fails.
function search(kind: "ok" | "error" | "pages") {
  return async (
    query: string,
    { signal, page }: { signal: AbortSignal; page: number }
  ) => {
    await wait(600, signal)
    if (kind === "error") {
      throw new Error("The server is down.")
    }
    const needle = query.trim().toLowerCase()
    const found = countries.filter((country) =>
      country.label.toLowerCase().includes(needle)
    )
    if (kind === "ok") {
      return found
    }
    return {
      items: found.slice(page * 5, page * 5 + 5),
      hasMore: found.length > page * 5 + 5,
    }
  }
}

// Shown while the input is empty, in the "recent" variant.
const recentCountries: ListData = [
  { type: "group", label: "Recent", items: [countries[0], countries[3]] },
]

// What ComboboxCreate's onCreate does for each kind. It only logs: created items aren't added.
function createHandler(
  kind: Variant["create"],
  log: (message: string) => void
) {
  return (query: string) => {
    log(`create "${query}"`)
    if (kind === "sync") {
      return
    }
    return wait(1200).then(() => {
      if (kind === "reject") {
        log(`create "${query}" failed`)
        throw new Error(`Couldn't create ${query}.`)
      }
      log(`create "${query}" done`)
    })
  }
}

const sides = ["top", "right", "bottom", "left"] as const
const aligns = ["start", "center", "end"] as const

const variants: Variant[] = [
  ...sides.flatMap((side) =>
    aligns.map((align) => ({
      id: `place-${side}-${align}`,
      section: "Placement",
      title: `${side} ${align}`,
      content: { side, align },
    }))
  ),

  {
    id: "offset-0",
    section: "Offsets",
    title: "sideOffset 0",
    content: { sideOffset: 0 },
  },
  {
    id: "offset-16",
    section: "Offsets",
    title: "sideOffset 16",
    content: { sideOffset: 16 },
  },
  {
    id: "align-16",
    section: "Offsets",
    title: "alignOffset 16",
    content: { alignOffset: 16 },
  },
  {
    id: "align-neg",
    section: "Offsets",
    title: "alignOffset -16",
    content: { alignOffset: -16 },
  },
  {
    id: "padding-48",
    section: "Offsets",
    title: "collisionPadding 48",
    note: "Bottom-right corner. Stays 48px from the edges.",
    place: "bottom-right",
    content: { collisionPadding: 48 },
  },

  {
    id: "filter-contains",
    section: "Filtering",
    title: 'filter "contains"',
    note: "Default. “an” finds Canada, Japan, Germany…",
    options: { filter: "contains" },
  },
  {
    id: "filter-starts",
    section: "Filtering",
    title: 'filter "startsWith"',
    note: "“a” finds Argentina, Australia, Austria.",
    options: { filter: "startsWith" },
  },
  {
    id: "filter-false",
    section: "Filtering",
    title: "filter false",
    note: "Every item stays, for results a server filtered.",
    options: { filter: false },
  },
  {
    id: "filter-function",
    section: "Filtering",
    title: "filter function",
    note: "Letters in order: “brz” finds Brazil.",
    options: { filter: "function" },
  },
  {
    id: "keywords",
    section: "Filtering",
    title: "Item keywords",
    note: "“holland”, “usa” or “nippon” find their country.",
  },
  {
    id: "auto-highlight",
    section: "Filtering",
    title: "autoHighlight",
    note: "The first match is highlighted while typing, so Enter chooses it.",
    options: { autoHighlight: true },
  },

  {
    id: "chips",
    section: "Multiple",
    title: "multiple with chips",
    note: "Backspace removes the last chip. Arrow left moves into the chips.",
    chips: true,
    options: { multiple: true },
  },
  {
    id: "chips-default",
    section: "Multiple",
    title: "Chips with defaultValue",
    chips: true,
    options: { multiple: true, defaultValue: ["fr", "jp"] },
  },
  {
    id: "max-selected",
    section: "Multiple",
    title: "maxSelected 2",
    note: "Once two are chosen, the rest are disabled.",
    chips: true,
    options: { multiple: true, maxSelected: 2 },
  },
  {
    id: "keep-query",
    section: "Multiple",
    title: "keepQuery",
    note: "The text stays after each choice.",
    chips: true,
    options: { multiple: true, keepQuery: true },
  },
  {
    id: "multiple-custom",
    section: "Multiple",
    title: "multiple with allowCustomValue",
    note: "Enter on text that matches nothing adds it as a chip.",
    chips: true,
    options: { multiple: true, allowCustomValue: true },
  },
  {
    id: "multiple-no-chips",
    section: "Multiple",
    title: "multiple without chips",
    note: "The input empties after each choice. Values show as checks.",
    options: { multiple: true },
  },

  {
    id: "custom-value",
    section: "Text",
    title: "allowCustomValue",
    note: "Text that matches nothing becomes the value on Enter or close.",
    options: { allowCustomValue: true },
  },
  {
    id: "default-query",
    section: "Text",
    title: "defaultQuery",
    options: { defaultQuery: "an" },
  },
  {
    id: "default-value",
    section: "Text",
    title: "defaultValue",
    note: "The input shows its label.",
    options: { defaultValue: "ca" },
  },

  {
    id: "create-sync",
    section: "Create",
    title: "ComboboxCreate",
    note: "Type a new name. onCreate logs it.",
    create: "sync",
  },
  {
    id: "create-async",
    section: "Create",
    title: "ComboboxCreate, async",
    note: "onCreate returns a Promise. data-pending shows for 1.2s.",
    create: "async",
  },
  {
    id: "create-reject",
    section: "Create",
    title: "ComboboxCreate, rejects",
    note: "The Promise fails after 1.2s. The error shows in the option.",
    create: "reject",
  },
  {
    id: "create-multiple",
    section: "Create",
    title: "ComboboxCreate with multiple",
    create: "async",
    chips: true,
    options: { multiple: true },
  },

  {
    id: "async",
    section: "Async",
    title: "Async options",
    note: "A fake server answers in 600ms. filter false, status, ComboboxStatus and ComboboxEmpty.",
    async: "ok",
  },
  {
    id: "async-error",
    section: "Async",
    title: "Async options that fail",
    note: 'status becomes "error".',
    async: "error",
  },
  {
    id: "async-pages",
    section: "Async",
    title: "onLoadMore",
    note: "Five at a time. The next page loads when the end of the list is reached.",
    async: "pages",
  },

  {
    id: "recent",
    section: "Rows",
    title: "emptyItems",
    note: "Recent countries while the input is empty. Labels mark what the text matched.",
    mode: "data",
    recent: true,
  },
  {
    id: "select-all",
    section: "Rows",
    title: "ComboboxSelectAll",
    note: "Selects every country that matches; mixed while some are.",
    chips: true,
    selectAll: true,
    options: { multiple: true },
  },
  {
    id: "overflow",
    section: "Rows",
    title: "ComboboxChipsOverflow",
    note: "Chips stay on one line and the rest collapse into +N more.",
    chips: true,
    overflow: true,
    options: { multiple: true, defaultValue: ["ar", "au", "at", "br", "ca"] },
  },
  {
    id: "value-max",
    section: "Rows",
    title: "ComboboxValue max",
    note: '"Argentina, Australia, and 1 more" beside the input.',
    chips: true,
    max: 2,
    options: { multiple: true, defaultValue: ["ar", "au", "at"] },
  },

  {
    id: "clear",
    section: "Parts",
    title: "ComboboxClear",
    note: "Shown while there's a value or text.",
    clear: "auto",
    options: { defaultValue: "br" },
  },
  {
    id: "clear-kept",
    section: "Parts",
    title: "ComboboxClear keepMounted",
    note: "Stays in the page while there's nothing to clear.",
    clear: "keep-mounted",
  },
  {
    id: "trigger",
    section: "Parts",
    title: "ComboboxTrigger",
    note: "Opens and closes the list. Out of the tab order.",
    trigger: true,
  },
  {
    id: "indicator-kept",
    section: "Parts",
    title: "ComboboxItemIndicator keepMounted",
    indicatorKeepMounted: true,
    options: { defaultValue: "at" },
  },
  {
    id: "arrow",
    section: "Parts",
    title: "ComboboxArrow",
    arrow: true,
    content: { sideOffset: 10 },
  },
  {
    id: "arrow-top",
    section: "Parts",
    title: "ComboboxArrow, top center",
    arrow: true,
    content: { side: "top", align: "center", sideOffset: 10 },
  },

  {
    id: "groups",
    section: "Items",
    title: "Groups and separators",
    note: "Denmark is disabled.",
    list: "grouped",
  },
  {
    id: "disabled-items",
    section: "Items",
    title: "Disabled items",
    note: "Arrow keys skip Denmark, and it can't be chosen.",
  },
  {
    id: "data",
    section: "Items",
    title: "Data items",
    mode: "data",
    options: { defaultValue: "fr" },
  },
  {
    id: "data-groups",
    section: "Items",
    title: "Data groups",
    mode: "data",
    list: "grouped",
  },
  {
    id: "many",
    section: "Items",
    title: "1,000 data items",
    note: "Filters without rendering every item.",
    mode: "data",
    list: "many",
  },
  {
    id: "objects",
    section: "Items",
    title: "Object values",
    note: "itemToValue and itemToLabel.",
    mode: "data",
    list: "objects",
  },

  {
    id: "form-required",
    section: "Form",
    title: "required",
    note: "Submit with nothing chosen: the browser blocks it.",
    form: true,
    options: { required: true, name: "country" },
  },
  {
    id: "form-reset",
    section: "Form",
    title: "defaultValue and Reset",
    note: "Change it, then Reset: back to Japan.",
    form: true,
    options: { name: "country", defaultValue: "jp" },
  },
  {
    id: "form-multiple",
    section: "Form",
    title: "multiple",
    note: "Submits one entry per value.",
    form: true,
    chips: true,
    options: { name: "countries", multiple: true, defaultValue: ["ar", "br"] },
  },
  {
    id: "form-disabled",
    section: "Form",
    title: "disabled",
    form: true,
    options: { name: "country", disabled: true, defaultValue: "fr" },
  },
  {
    id: "form-readonly",
    section: "Form",
    title: "readOnly",
    note: "Focusable, doesn't open. Still submits.",
    form: true,
    options: { name: "country", readOnly: true, defaultValue: "fr" },
  },

  {
    id: "modal-false",
    section: "Modal",
    title: "modal false",
    note: "Default. The page stays usable.",
    options: { modal: false },
  },
  {
    id: "modal-pointer",
    section: "Modal",
    title: 'modal "pointer"',
    note: "An outside press only closes the list.",
    options: { modal: "pointer" },
  },
  {
    id: "modal-true",
    section: "Modal",
    title: "modal true",
    note: "Also locks scroll and makes the page inert.",
    options: { modal: true },
  },

  {
    id: "loop-false",
    section: "Behavior",
    title: "loop false",
    note: "Arrow keys stop at the ends.",
    options: { loop: false },
  },
  {
    id: "controlled-value",
    section: "Behavior",
    title: "Controlled value",
    controlled: "value",
  },
  {
    id: "controlled-open",
    section: "Behavior",
    title: "Controlled open",
    controlled: "open",
  },
  {
    id: "controlled-query",
    section: "Behavior",
    title: "Controlled query",
    controlled: "query",
  },
  {
    id: "controller",
    section: "Behavior",
    title: "Controller",
    controller: true,
  },
  {
    id: "controller-multiple",
    section: "Behavior",
    title: "Controller with multiple",
    controller: true,
    chips: true,
    options: { multiple: true },
  },
  {
    id: "debug",
    section: "Behavior",
    title: "debug",
    note: "Logs state changes to the console.",
    options: { debug: true },
  },

  {
    id: "corner-tl",
    section: "Collisions",
    title: "Top-left corner",
    place: "top-left",
  },
  {
    id: "corner-tr",
    section: "Collisions",
    title: "Top-right corner",
    note: "Shifts left to stay on screen.",
    place: "top-right",
    content: { align: "end" },
  },
  {
    id: "corner-bl",
    section: "Collisions",
    title: "Bottom-left corner",
    note: "Flips above the input.",
    place: "bottom-left",
  },
  {
    id: "corner-br",
    section: "Collisions",
    title: "Bottom-right corner",
    note: "Flips above, aligned to the end.",
    place: "bottom-right",
    content: { align: "end" },
  },

  {
    id: "portal",
    section: "Containers",
    title: "container",
    note: "Renders into a container at the end of the body.",
    portal: true,
  },
  {
    id: "scroll",
    section: "Containers",
    title: "Inside a scroll area",
    note: "Scroll the box.",
    place: "scroll",
  },
  {
    id: "clip",
    section: "Containers",
    title: "Inside overflow hidden",
    place: "clip",
  },
  {
    id: "transform",
    section: "Containers",
    title: "Inside a transform",
    place: "transform",
  },
  {
    id: "rtl",
    section: "Containers",
    title: "Right to left",
    place: "rtl",
    options: { defaultValue: "ar" },
  },
  {
    id: "rtl-chips",
    section: "Containers",
    title: "Right to left with chips",
    note: "Arrow right moves into the chips.",
    place: "rtl",
    chips: true,
    options: { multiple: true, defaultValue: ["ar", "br"] },
  },

  { id: "anim-none", section: "Animation", title: "None", animation: "none" },
  {
    id: "anim-default",
    section: "Animation",
    title: "Scale and fade",
    animation: "default",
  },
  {
    id: "anim-slow",
    section: "Animation",
    title: "Slow slide",
    note: "700ms.",
    animation: "slow",
  },
]

export {
  countries,
  type Country,
  createHandler,
  defaultValueOf,
  filterOf,
  fuzzy,
  type List,
  listOf,
  objectOptions,
  recentCountries,
  sampleValue,
  search,
  type Variant,
  variants,
}
