import type { ListItem, ListData } from "@ui-sdk/core/autocomplete"
import type { Animation } from "./classes"

// Every scenario in the kitchen sink. Each framework renders the same list.
type Variant = {
  id: string
  section: string
  title: string
  note?: string
  // Which suggestions the autocomplete holds.
  list?: List
  // Composition renders AutocompleteItem parts in an AutocompleteList. Data passes `items` and renders the parts from the list's state.
  mode?: "composition" | "data"
  options?: {
    defaultValue?: string
    filter?: "contains" | "startsWith" | "fuzzy" | false | "function"
    inlineComplete?: boolean
    autoHighlight?: boolean
    openOnFocus?: boolean
    submitOnSelect?: boolean
    loop?: boolean
    modal?: boolean | "pointer"
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
    keepMounted?: boolean
  }
  // Positions the suggestions against a box around the field, through the content's `anchor`.
  anchor?: boolean
  // An AutocompleteTrigger button beside the input.
  trigger?: boolean
  // An AutocompleteClear button, shown while there's text, or always.
  clear?: "auto" | "keep-mounted"
  // Results from a fake server, with `filter={false}`, `status`, AutocompleteStatus and AutocompleteEmpty. Error always fails.
  async?: "ok" | "error"
  arrow?: boolean
  // Wraps the autocomplete in a form with Submit and Reset.
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
  controlled?: "value" | "open"
  controller?: boolean
}

type List = "fruits" | "grouped" | "many"

const fruits: ListItem[] = [
  { value: "apple", label: "Apple" },
  { value: "apricot", label: "Apricot" },
  { value: "avocado", label: "Avocado" },
  { value: "banana", label: "Banana" },
  { value: "blackberry", label: "Blackberry" },
  { value: "blueberry", label: "Blueberry" },
  { value: "cherry", label: "Cherry" },
  { value: "durian", label: "Durian", disabled: true },
  { value: "grape", label: "Grape" },
  { value: "kiwi", label: "Kiwi", keywords: ["gooseberry"] },
  { value: "lemon", label: "Lemon", keywords: ["citrus"] },
  { value: "lime", label: "Lime", keywords: ["citrus"] },
  { value: "mango", label: "Mango" },
  { value: "orange", label: "Orange", keywords: ["citrus"] },
  { value: "pineapple", label: "Pineapple", keywords: ["ananas"] },
  { value: "strawberry", label: "Strawberry" },
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
      { value: "asparagus", label: "Asparagus" },
      { value: "broccoli", label: "Broccoli", disabled: true },
      { value: "carrot", label: "Carrot" },
    ],
  },
  { type: "separator" },
  {
    type: "group",
    label: "Herbs",
    items: [
      { value: "basil", label: "Basil" },
      { value: "chives", label: "Chives" },
    ],
  },
]

const many: ListData = Array.from({ length: 1000 }, (_, index) => ({
  value: `item-${index + 1}`,
  label: `Item ${index + 1}`,
}))

function listOf(variant: Variant) {
  switch (variant.list) {
    case "grouped":
      return grouped
    case "many":
      return many
    default:
      return fruits
  }
}

// Matches when the text's letters appear in order, like "bnn" for Banana.
function inOrder(item: ListItem<any>, query: string) {
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

// The filter option, with "function" standing for `inOrder`.
function filterOf(variant: Variant) {
  const filter = variant.options?.filter
  return filter === "function" ? inOrder : filter
}

// The selector of the box the content's `anchor` points at.
function anchorOf(variant: Variant) {
  return variant.anchor ? `#anchor-${variant.id}` : undefined
}

const wait = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener("abort", () => {
      clearTimeout(timer)
      reject(signal.reason)
    })
  })

// A fake server: fruits containing the text, after 600ms. "error" always fails.
function search(kind: "ok" | "error") {
  return async (query: string, { signal }: { signal: AbortSignal }) => {
    await wait(600, signal)
    if (kind === "error") {
      throw new Error("The server is down.")
    }
    const needle = query.trim().toLowerCase()
    return fruits.filter((fruit) => fruit.label.toLowerCase().includes(needle))
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
    id: "anchor",
    section: "Offsets",
    title: "anchor",
    note: "The suggestions line up with the dashed box, not the field.",
    anchor: true,
  },
  {
    id: "keep-mounted",
    section: "Offsets",
    title: "keepMounted",
    note: "The content stays in the page, hidden, while closed.",
    content: { keepMounted: true },
  },

  {
    id: "filter-contains",
    section: "Filtering",
    title: 'filter "contains"',
    note: "Default. “an” finds Banana, Mango, Orange…",
    options: { filter: "contains" },
  },
  {
    id: "filter-starts",
    section: "Filtering",
    title: 'filter "startsWith"',
    note: "“b” finds Banana, Blackberry, Blueberry.",
    options: { filter: "startsWith" },
  },
  {
    id: "filter-fuzzy",
    section: "Filtering",
    title: 'filter "fuzzy"',
    note: "Best matches first. “bry” finds the berries.",
    options: { filter: "fuzzy" },
  },
  {
    id: "filter-false",
    section: "Filtering",
    title: "filter false",
    note: "Every suggestion stays, for results a server filtered.",
    options: { filter: false },
  },
  {
    id: "filter-function",
    section: "Filtering",
    title: "filter function",
    note: "Letters in order: “bnn” finds Banana.",
    options: { filter: "function" },
  },
  {
    id: "keywords",
    section: "Filtering",
    title: "Item keywords",
    note: "“citrus”, “ananas” or “gooseberry” find their fruit.",
  },

  {
    id: "inline",
    section: "Completion",
    title: "inlineComplete",
    note: "“ba” completes to Banana, with “nana” selected. ArrowRight accepts, Backspace takes it back.",
    options: { inlineComplete: true },
  },
  {
    id: "auto-highlight",
    section: "Completion",
    title: "autoHighlight",
    note: "The first match is highlighted while typing, so Enter chooses it.",
    options: { autoHighlight: true },
  },
  {
    id: "inline-auto",
    section: "Completion",
    title: "inlineComplete and autoHighlight",
    options: { inlineComplete: true, autoHighlight: true },
  },
  {
    id: "open-on-focus",
    section: "Completion",
    title: "openOnFocus",
    note: "Opens on focus, before anything is typed, like recent searches.",
    options: { openOnFocus: true },
  },
  {
    id: "default-value",
    section: "Completion",
    title: "defaultValue",
    note: "Starts with “Ch”, which filters the suggestions.",
    options: { defaultValue: "Ch" },
  },

  {
    id: "submit",
    section: "Submit",
    title: "onSubmit",
    note: "Enter with nothing highlighted runs onSubmit, then the form submits.",
    form: true,
    options: { name: "q" },
  },
  {
    id: "submit-on-select",
    section: "Submit",
    title: "submitOnSelect",
    note: "Choosing a suggestion submits, like a search box.",
    form: true,
    options: { name: "q", submitOnSelect: true },
  },

  {
    id: "async",
    section: "Async",
    title: "Async suggestions",
    note: "A fake server answers in 600ms. filter false, status, AutocompleteStatus and AutocompleteEmpty.",
    async: "ok",
  },
  {
    id: "async-error",
    section: "Async",
    title: "Async suggestions that fail",
    note: 'status becomes "error".',
    async: "error",
  },

  {
    id: "clear",
    section: "Parts",
    title: "AutocompleteClear",
    note: "Shown while there's text.",
    clear: "auto",
    options: { defaultValue: "Mango" },
  },
  {
    id: "clear-kept",
    section: "Parts",
    title: "AutocompleteClear keepMounted",
    note: "Stays in the page while the field is empty.",
    clear: "keep-mounted",
  },
  {
    id: "trigger",
    section: "Parts",
    title: "AutocompleteTrigger",
    note: "Opens and closes the suggestions. Out of the tab order.",
    trigger: true,
  },
  {
    id: "arrow",
    section: "Parts",
    title: "AutocompleteArrow",
    arrow: true,
    content: { sideOffset: 10 },
  },
  {
    id: "arrow-top",
    section: "Parts",
    title: "AutocompleteArrow, top center",
    arrow: true,
    content: { side: "top", align: "center", sideOffset: 10 },
  },

  {
    id: "groups",
    section: "Items",
    title: "Groups and separators",
    note: "Broccoli is disabled.",
    list: "grouped",
  },
  {
    id: "disabled-items",
    section: "Items",
    title: "Disabled items",
    note: "Arrow keys skip Durian, and it can't be chosen.",
  },
  { id: "data", section: "Items", title: "Data items", mode: "data" },
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
    id: "form-required",
    section: "Form",
    title: "required",
    note: "Submit while empty: the browser blocks it.",
    form: true,
    options: { required: true, name: "fruit" },
  },
  {
    id: "form-reset",
    section: "Form",
    title: "defaultValue and Reset",
    note: "Change it, then Reset: back to Lemon.",
    form: true,
    options: { name: "fruit", defaultValue: "Lemon" },
  },
  {
    id: "form-disabled",
    section: "Form",
    title: "disabled",
    note: "Not focusable, not submitted.",
    form: true,
    options: { name: "fruit", disabled: true, defaultValue: "Apple" },
  },
  {
    id: "form-readonly",
    section: "Form",
    title: "readOnly",
    note: "Focusable, doesn't open. Still submits.",
    form: true,
    options: { name: "fruit", readOnly: true, defaultValue: "Apple" },
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
    note: "An outside press only closes the suggestions.",
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
    id: "controller",
    section: "Behavior",
    title: "Controller",
    controller: true,
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
    trigger: true,
    clear: "auto",
    options: { defaultValue: "A" },
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
  anchorOf,
  filterOf,
  fruits,
  inOrder,
  type List,
  listOf,
  search,
  type Variant,
  variants,
}
