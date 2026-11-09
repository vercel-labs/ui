import type { ListData } from "@ui-sdk/core/select"
import type { Animation } from "./classes"

// Every scenario in the kitchen sink. Each framework renders the same list.
type Variant = {
  id: string
  section: string
  title: string
  note?: string
  // Which items the select holds.
  list?: List
  // Composition renders SelectItem parts inside SelectContent. Data passes `items` and renders the
  // parts from the list's state.
  mode?: "composition" | "data"
  options?: {
    placeholder?: string
    multiple?: boolean
    defaultValue?: string | string[]
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
    alignItemWithTrigger?: boolean
  }
  // SelectTrigger's own `disabled`.
  triggerDisabled?: boolean
  // A SelectClear button, shown while something is selected, or always.
  clear?: "auto" | "keep-mounted"
  // SelectItemIndicator's `keepMounted`, so unselected items keep a hidden check.
  indicatorKeepMounted?: boolean
  arrow?: boolean
  // Wraps the select in a form with Submit and Reset.
  form?: boolean
  animation?: Animation
  // Positions against a separate element instead of the trigger.
  anchor?: boolean
  // Where the trigger sits.
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
  controlled?: "value" | "open"
  controller?: boolean
  // A SelectInput that searches the list, with matches marked and an empty message.
  search?: boolean
  // Items shown while the search is empty.
  recent?: boolean
  // A select-all option, in each group too.
  selectAll?: boolean
  // SelectValue's `max`: labels shown before the rest are counted.
  max?: number
}

// Shown while the search is empty, in the "recent" variant.
const recentItems: ListData = [
  {
    type: "group",
    label: "Recent",
    items: [{ value: "pineapple", label: "Pineapple" }],
  },
]

type List = "fruits" | "grouped" | "long" | "many" | "countries"

type Country = { code: string; name: string }

const fruits: ListData = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "durian", label: "Durian", disabled: true },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
]

const grouped: ListData = [
  {
    type: "group",
    label: "Fruits",
    items: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
      { value: "cherry", label: "Cherry" },
    ],
  },
  { type: "separator" },
  {
    type: "group",
    label: "Vegetables",
    items: [
      { value: "carrot", label: "Carrot" },
      { value: "kale", label: "Kale", disabled: true },
      { value: "leek", label: "Leek" },
    ],
  },
  { type: "separator" },
  {
    type: "group",
    label: "Grains",
    items: [
      { value: "oats", label: "Oats" },
      { value: "rice", label: "Rice" },
    ],
  },
]

const long: ListData = Array.from({ length: 40 }, (_, index) => ({
  value: `option-${index + 1}`,
  label: `Option ${index + 1}`,
}))

const many: ListData = Array.from({ length: 1000 }, (_, index) => ({
  value: `item-${index + 1}`,
  label: `Item ${index + 1}`,
}))

const countries: Country[] = [
  { code: "ar", name: "Argentina" },
  { code: "br", name: "Brazil" },
  { code: "ca", name: "Canada" },
  { code: "fr", name: "France" },
  { code: "jp", name: "Japan" },
  { code: "ke", name: "Kenya" },
]

// Object values. `itemToValue` names them in forms and keys, `itemToLabel` shows them.
const countryOptions = {
  itemToValue: (country: Country) => country.code,
  itemToLabel: (country: Country) => country.name,
}

function listOf(variant: Variant) {
  switch (variant.list) {
    case "grouped":
      return grouped
    case "long":
      return long
    case "many":
      return many
    case "countries":
      return countries.map((country) => ({
        value: country,
        label: country.name,
      }))
    default:
      return fruits
  }
}

// The value at first. Countries are objects, so their keys are looked up.
function defaultValueOf(variant: Variant) {
  const value = variant.options?.defaultValue
  if (variant.list !== "countries" || value === undefined) {
    return value
  }
  const find = (code: string) =>
    countries.find((country) => country.code === code)
  return Array.isArray(value) ? value.map(find) : find(value)
}

// SelectValue's own placeholder, for variants that don't set the select's.
function valuePlaceholder(variant: Variant) {
  return variant.options?.placeholder ? undefined : "Select…"
}

// The controller's "Set" button picks this.
function sampleValue(variant: Variant) {
  if (variant.options?.multiple) {
    return ["apple", "banana"]
  }
  if (variant.list === "countries") {
    return countries[3]
  }
  return "banana"
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
    note: "Bottom-right corner, 40 items. Stays 48px from the edges.",
    list: "long",
    place: "bottom-right",
    content: { collisionPadding: 48 },
  },

  {
    id: "item-aligned",
    section: "Align item with trigger",
    title: "With a value",
    note: "Banana sits on the trigger, like a native select on macOS.",
    options: { defaultValue: "banana" },
    content: { alignItemWithTrigger: true },
  },
  {
    id: "item-aligned-empty",
    section: "Align item with trigger",
    title: "Without a value",
    note: "The first item sits on the trigger.",
    content: { alignItemWithTrigger: true },
  },
  {
    id: "item-aligned-long",
    section: "Align item with trigger",
    title: "Value far down a long list",
    note: "Option 30 of 40. Falls back to below when it doesn't fit.",
    list: "long",
    options: { defaultValue: "option-30" },
    content: { alignItemWithTrigger: true },
  },
  {
    id: "item-aligned-corner",
    section: "Align item with trigger",
    title: "Near the bottom edge",
    note: "Bottom-left corner. Pineapple is last, so the list rises over the trigger.",
    place: "bottom-left",
    options: { defaultValue: "pineapple" },
    content: { alignItemWithTrigger: true },
  },

  {
    id: "placeholder",
    section: "Value",
    title: "placeholder",
    options: { placeholder: "Pick a fruit…" },
  },
  {
    id: "default",
    section: "Value",
    title: "defaultValue",
    options: { defaultValue: "grapes" },
  },
  {
    id: "multiple",
    section: "Value",
    title: "multiple",
    note: "Stays open as items toggle. The trigger lists the labels.",
    options: { multiple: true, placeholder: "Pick fruits…" },
  },
  {
    id: "multiple-default",
    section: "Value",
    title: "multiple with defaultValue",
    options: { multiple: true, defaultValue: ["apple", "pineapple"] },
  },
  {
    id: "clear",
    section: "Value",
    title: "SelectClear",
    note: "Shown while something is selected.",
    options: { defaultValue: "apple", placeholder: "Pick a fruit…" },
    clear: "auto",
  },
  {
    id: "clear-kept",
    section: "Value",
    title: "SelectClear keepMounted",
    note: "Stays in the page while nothing is selected.",
    options: { placeholder: "Pick a fruit…" },
    clear: "keep-mounted",
  },
  {
    id: "clear-multiple",
    section: "Value",
    title: "SelectClear with multiple",
    options: { multiple: true, defaultValue: ["banana", "grapes"] },
    clear: "auto",
  },
  {
    id: "indicator-kept",
    section: "Value",
    title: "SelectItemIndicator keepMounted",
    note: "Every item keeps its check, hidden until selected.",
    indicatorKeepMounted: true,
    options: { defaultValue: "blueberry" },
  },

  {
    id: "groups",
    section: "Items",
    title: "Groups and separators",
    note: "Kale is disabled.",
    list: "grouped",
  },
  {
    id: "disabled-items",
    section: "Items",
    title: "Disabled items",
    note: "Durian is disabled. Arrow keys skip it, and it can't be chosen.",
  },
  {
    id: "data",
    section: "Items",
    title: "Data items",
    mode: "data",
    options: { defaultValue: "apple" },
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
    note: "Type on the closed trigger to jump: “Item 5”.",
    mode: "data",
    list: "many",
  },
  {
    id: "objects",
    section: "Items",
    title: "Object values",
    note: "itemToValue and itemToLabel. Submits the code, shows the name.",
    mode: "data",
    list: "countries",
    options: { defaultValue: "jp" },
  },
  {
    id: "long",
    section: "Items",
    title: "Long list",
    note: "Capped by --available-height. Scrolls.",
    list: "long",
  },

  {
    id: "form-required",
    section: "Form",
    title: "required",
    note: "Submit with nothing selected: the browser blocks it.",
    form: true,
    options: { required: true, name: "fruit", placeholder: "Pick a fruit…" },
  },
  {
    id: "form-reset",
    section: "Form",
    title: "defaultValue and Reset",
    note: "Change it, then Reset: back to Grapes.",
    form: true,
    options: { name: "fruit", defaultValue: "grapes" },
  },
  {
    id: "form-multiple",
    section: "Form",
    title: "multiple",
    note: "Submits one entry per value.",
    form: true,
    options: {
      name: "fruits",
      multiple: true,
      defaultValue: ["apple", "banana"],
    },
  },
  {
    id: "form-disabled",
    section: "Form",
    title: "disabled",
    note: "Can't be focused or changed. Submits nothing.",
    form: true,
    options: { name: "fruit", disabled: true, defaultValue: "apple" },
  },
  {
    id: "form-readonly",
    section: "Form",
    title: "readOnly",
    note: "Focusable and opens, but can't change. Still submits.",
    form: true,
    options: { name: "fruit", readOnly: true, defaultValue: "apple" },
  },
  {
    id: "trigger-disabled",
    section: "Form",
    title: "SelectTrigger disabled",
    note: "The trigger's own prop.",
    form: true,
    triggerDisabled: true,
    options: { name: "fruit", defaultValue: "banana" },
  },

  {
    id: "modal-pointer",
    section: "Modal",
    title: 'modal "pointer"',
    note: "Default. An outside press only closes the list.",
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
    id: "modal-false",
    section: "Modal",
    title: "modal false",
    note: "Outside presses close and reach what they hit.",
    options: { modal: false },
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
    id: "arrow-bottom",
    section: "Arrow",
    title: "SelectArrow",
    arrow: true,
    content: { sideOffset: 10 },
  },
  {
    id: "arrow-top",
    section: "Arrow",
    title: "SelectArrow, top center",
    arrow: true,
    content: { side: "top", align: "center", sideOffset: 10 },
  },
  {
    id: "arrow-right",
    section: "Arrow",
    title: "SelectArrow, right",
    arrow: true,
    content: { side: "right", align: "center", sideOffset: 10 },
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
    note: "Flips above the trigger.",
    place: "bottom-left",
    list: "long",
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
    options: { defaultValue: "apple" },
  },
  {
    id: "anchor",
    section: "Containers",
    title: "Custom anchor",
    note: "Positions against the dashed box, not the trigger.",
    anchor: true,
  },

  {
    id: "search",
    section: "Search and rows",
    title: "SelectInput",
    note: "Typing filters and marks matches; focus stays in the field.",
    search: true,
  },
  {
    id: "search-groups",
    section: "Search and rows",
    title: "SelectInput with groups",
    search: true,
    list: "grouped",
  },
  {
    id: "search-data",
    section: "Search and rows",
    title: "SelectInput over data",
    mode: "data",
    list: "many",
    search: true,
  },
  {
    id: "search-recent",
    section: "Search and rows",
    title: "emptyItems",
    note: "Recent items while the search is empty.",
    mode: "data",
    search: true,
    recent: true,
  },
  {
    id: "select-all",
    section: "Search and rows",
    title: "SelectSelectAll",
    selectAll: true,
    options: { multiple: true, defaultValue: ["apple"] },
  },
  {
    id: "select-all-groups",
    section: "Search and rows",
    title: "SelectSelectAll in groups",
    list: "grouped",
    selectAll: true,
    search: true,
    options: { multiple: true },
  },
  {
    id: "value-max",
    section: "Search and rows",
    title: "SelectValue max",
    note: '"Apple, Banana, and 2 more".',
    max: 2,
    options: {
      multiple: true,
      defaultValue: ["apple", "banana", "grapes", "pineapple"],
    },
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
  countryOptions,
  defaultValueOf,
  fruits,
  grouped,
  type List,
  listOf,
  recentItems,
  sampleValue,
  valuePlaceholder,
  type Variant,
  variants,
}
