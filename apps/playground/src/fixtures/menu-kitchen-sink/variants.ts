import type { MenuData } from "@ui-sdk/core/menu"
import type { Animation } from "./classes"

// Every scenario in the kitchen sink. Each framework renders the same list.
type Variant = {
  id: string
  section: string
  title: string
  note?: string
  trigger?: string
  items: MenuData
  // Composition with MenuItems inside MenuContent, or a data menu with `items`.
  mode?: "composition" | "data"
  options?: {
    modal?: boolean | "pointer"
    presentation?: "auto" | "popover" | "sheet"
    loop?: boolean
    delay?: number
    itemShortcuts?: boolean
    debug?: boolean
  }
  content?: {
    side?: "top" | "right" | "bottom" | "left"
    align?: "start" | "center" | "end"
    sideOffset?: number
    alignOffset?: number
    collisionPadding?: number
  }
  animation?: Animation
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
  controlled?: boolean
  controller?: boolean
}

const short: MenuData = [
  { value: "edit", label: "Edit" },
  { value: "duplicate", label: "Duplicate" },
  { value: "delete", label: "Delete" },
]

const basic: MenuData = [
  { value: "new", label: "New file", shortcut: "mod+n" },
  { value: "open", label: "Open…", shortcut: "mod+o" },
  { value: "save", label: "Save", disabled: true },
  { type: "separator" },
  { value: "delete", label: "Delete" },
]

const everything: MenuData = [
  { value: "new", label: "New file", shortcut: "mod+n" },
  { value: "save", label: "Save", disabled: true },
  { type: "separator" },
  {
    type: "group",
    label: "Show",
    items: [
      { type: "checkbox", value: "toolbar", label: "Toolbar", defaultChecked: true },
      { type: "checkbox", value: "status", label: "Status bar" },
    ],
  },
  { type: "separator" },
  {
    type: "radio-group",
    name: "density",
    label: "Density",
    defaultValue: "comfortable",
    items: [
      { value: "compact", label: "Compact" },
      { value: "comfortable", label: "Comfortable" },
      { value: "spacious", label: "Spacious" },
    ],
  },
  { type: "separator" },
  {
    type: "submenu",
    label: "Share",
    items: [
      { value: "email", label: "Email" },
      { value: "link", label: "Copy link" },
      { type: "submenu", label: "More", items: [{ value: "embed", label: "Embed" }] },
    ],
  },
  { type: "submenu", label: "Export", disabled: true, items: [{ value: "pdf", label: "PDF" }] },
]

const nested: MenuData = [
  { value: "undo", label: "Undo" },
  {
    type: "submenu",
    label: "Level 1",
    items: [
      { value: "one-a", label: "Item 1A" },
      {
        type: "submenu",
        label: "Level 2",
        items: [
          { value: "two-a", label: "Item 2A" },
          {
            type: "submenu",
            label: "Level 3",
            items: [
              { value: "three-a", label: "Item 3A" },
              { value: "three-b", label: "Item 3B" },
            ],
          },
        ],
      },
      { value: "one-b", label: "Item 1B" },
    ],
  },
  { value: "redo", label: "Redo" },
]

const countries: MenuData = [
  "Argentina",
  "Australia",
  "Austria",
  "Belgium",
  "Brazil",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "Croatia",
  "Czechia",
  "Denmark",
  "Egypt",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Ghana",
  "Greece",
  "Hungary",
  "Iceland",
  "India",
  "Ireland",
  "Italy",
  "Japan",
  "Kenya",
  "Mexico",
  "Morocco",
  "Netherlands",
  "Norway",
  "Peru",
  "Poland",
  "Portugal",
  "Senegal",
  "Spain",
  "Sweden",
  "Switzerland",
  "Thailand",
  "Uruguay",
  "Vietnam",
].map((label) => ({ value: label.toLowerCase(), label }))

const keepOpen: MenuData = [
  { value: "increase", label: "Increase (stays open)", closeOnSelect: false },
  { value: "decrease", label: "Decrease (stays open)", closeOnSelect: false },
  { type: "separator" },
  { type: "checkbox", value: "wrap", label: "Wrap (closes on toggle)", closeOnSelect: true },
  { value: "done", label: "Done" },
]

const sides = ["top", "right", "bottom", "left"] as const
const aligns = ["start", "center", "end"] as const

const variants: Variant[] = [
  ...sides.flatMap((side) =>
    aligns.map((align) => ({
      id: `place-${side}-${align}`,
      section: "Placement",
      title: `${side} ${align}`,
      trigger: `${side} / ${align}`,
      items: short,
      content: { side, align },
    })),
  ),

  { id: "offset-0", section: "Offsets", title: "sideOffset 0", items: short, content: { sideOffset: 0 } },
  { id: "offset-16", section: "Offsets", title: "sideOffset 16", items: short, content: { sideOffset: 16 } },
  { id: "align-16", section: "Offsets", title: "alignOffset 16", items: short, content: { alignOffset: 16 } },
  {
    id: "align-neg",
    section: "Offsets",
    title: "alignOffset -16",
    items: short,
    content: { alignOffset: -16 },
  },
  {
    id: "padding-48",
    section: "Offsets",
    title: "collisionPadding 48",
    note: "Bottom-right corner. Stays 48px from the edges.",
    trigger: "↘ padding 48",
    items: basic,
    place: "bottom-right",
    content: { collisionPadding: 48 },
  },

  {
    id: "corner-tl",
    section: "Collisions",
    title: "Top-left corner",
    trigger: "↖",
    items: everything,
    place: "top-left",
  },
  {
    id: "corner-tr",
    section: "Collisions",
    title: "Top-right corner",
    note: "Submenus flip to the left.",
    trigger: "↗",
    items: everything,
    place: "top-right",
  },
  {
    id: "corner-bl",
    section: "Collisions",
    title: "Bottom-left corner",
    note: "Flips above the trigger.",
    trigger: "↙",
    items: everything,
    place: "bottom-left",
  },
  {
    id: "long",
    section: "Collisions",
    title: "Long menu",
    note: "Capped by --available-height. Scrolls. Type to jump.",
    trigger: "Country",
    items: countries,
  },
  {
    id: "long-top",
    section: "Collisions",
    title: "Long menu, side top",
    note: "Less room above, so it flips or caps.",
    trigger: "Country",
    items: countries,
    content: { side: "top" },
  },

  { id: "sub-nested", section: "Submenus", title: "Three levels", items: nested },
  {
    id: "sub-instant",
    section: "Submenus",
    title: "delay 0",
    items: nested,
    options: { delay: 0 },
  },
  {
    id: "sub-slow",
    section: "Submenus",
    title: "delay 500",
    items: nested,
    options: { delay: 500 },
  },
  {
    id: "sub-everything",
    section: "Submenus",
    title: "Mixed, disabled submenu",
    note: "Export is a disabled submenu.",
    items: everything,
  },

  { id: "items-everything", section: "Items", title: "Checkbox, radio, groups", items: everything },
  { id: "items-keep-open", section: "Items", title: "closeOnSelect", items: keepOpen },
  {
    id: "items-loop",
    section: "Items",
    title: "loop false",
    note: "Arrows stop at the ends.",
    items: basic,
    options: { loop: false },
  },
  {
    id: "items-typeahead",
    section: "Items",
    title: "Typeahead",
    note: "Open, then type “sw” or “po”.",
    trigger: "Country",
    items: countries,
  },
  {
    id: "items-shortcuts",
    section: "Items",
    title: "Global shortcuts",
    note: "Data menu. ⌘N or Ctrl+N runs New file while closed.",
    items: basic,
    mode: "data",
    options: { itemShortcuts: true },
  },

  {
    id: "modal-pointer",
    section: "Behavior",
    title: "modal pointer",
    note: "Default. Outside clicks only close.",
    items: basic,
    options: { modal: "pointer" },
  },
  {
    id: "modal-true",
    section: "Behavior",
    title: "modal true",
    note: "Locks scroll. Outside is inert.",
    items: basic,
    options: { modal: true },
  },
  {
    id: "modal-false",
    section: "Behavior",
    title: "modal false",
    note: "Outside clicks reach what they hit.",
    items: basic,
    options: { modal: false },
  },
  {
    id: "sheet",
    section: "Behavior",
    title: "presentation sheet",
    items: everything,
    options: { presentation: "sheet" },
  },
  {
    id: "auto",
    section: "Behavior",
    title: "presentation auto",
    note: "Sheet on small touch screens.",
    items: basic,
    options: { presentation: "auto" },
  },
  { id: "controlled", section: "Behavior", title: "Controlled open", items: basic, controlled: true },
  { id: "controller", section: "Behavior", title: "Controller", items: basic, controller: true },
  {
    id: "debug",
    section: "Behavior",
    title: "debug",
    note: "Logs state changes to the console.",
    items: basic,
    options: { debug: true },
  },
  {
    id: "data",
    section: "Behavior",
    title: "Data menu",
    note: "items, with parts rendered from them.",
    items: everything,
    mode: "data",
  },

  {
    id: "portal",
    section: "Containers",
    title: "Portaled",
    note: "Renders into a container outside this card.",
    items: everything,
    portal: true,
  },
  {
    id: "scroll",
    section: "Containers",
    title: "Inside a scroll area",
    note: "Scroll the box. The menu follows.",
    items: basic,
    place: "scroll",
  },
  {
    id: "clip",
    section: "Containers",
    title: "Inside overflow hidden",
    note: "The top layer escapes clipping.",
    items: basic,
    place: "clip",
  },
  {
    id: "transform",
    section: "Containers",
    title: "Inside a transform",
    note: "A scaled, rotated parent.",
    items: basic,
    place: "transform",
  },
  {
    id: "rtl",
    section: "Containers",
    title: "Right to left",
    note: "ArrowLeft opens submenus.",
    items: everything,
    place: "rtl",
  },

  { id: "anim-none", section: "Animation", title: "None", items: basic, animation: "none" },
  { id: "anim-default", section: "Animation", title: "Scale and fade", items: basic, animation: "default" },
  {
    id: "anim-slow",
    section: "Animation",
    title: "Slow slide",
    note: "700ms. Close it mid-animation to test.",
    items: basic,
    animation: "slow",
  },
]

export { type Variant, variants }
