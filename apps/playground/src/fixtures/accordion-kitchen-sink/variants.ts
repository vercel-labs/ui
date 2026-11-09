import type { Animation } from "./classes"

// Every scenario in the kitchen sink. Each framework renders the same list.
type Variant = {
  id: string
  section: string
  title: string
  note?: string
  options?: {
    multiple?: boolean
    collapsible?: boolean
    disabled?: boolean
    keepMounted?: boolean
    hiddenUntilFound?: boolean
    defaultValue?: string[]
    debug?: boolean
  }
  // How many items, from the shared list.
  count?: number
  // Values of disabled items, and of items whose trigger alone is disabled.
  disabledItems?: string[]
  disabledTriggers?: string[]
  // Panel props, applied to the second item.
  panel?: { keepMounted?: boolean; hiddenUntilFound?: boolean }
  // What the second item's panel holds.
  body?: "text" | "long" | "form" | "nested" | "nested-deep" | "grow"
  animation?: Animation
  // Where the accordion sits.
  place?: "card" | "rtl" | "scroll" | "transform" | "row"
  controlled?: boolean
  controller?: boolean
  // Expand all and Collapse all buttons, through a controller's openAll() and closeAll().
  expandAll?: boolean
  // Shows each item's index, and a button that reverses the items.
  index?: boolean
  // Cancels opening this item, from the accordion or from the item.
  cancel?: string
  itemCancel?: string
}

const items = [
  {
    value: "a",
    label: "Is it accessible?",
    content: "Yes. It follows the WAI-ARIA accordion pattern.",
  },
  {
    value: "b",
    label: "Is it unstyled?",
    content: "Yes. Every part takes your classes.",
  },
  {
    value: "c",
    label: "Can it animate?",
    content: "Yes. Search the page for needle to open this one.",
  },
  {
    value: "d",
    label: "Does it work everywhere?",
    content: "Yes. Every framework has the same parts.",
  },
  {
    value: "e",
    label: "Does it render on the server?",
    content: "Yes. Open panels show before hydration.",
  },
  {
    value: "f",
    label: "Can I control it?",
    content: "Yes. Pass a value, or use a controller.",
  },
  {
    value: "g",
    label: "Can items be disabled?",
    content: "Yes. Disabled triggers stay focusable.",
  },
  {
    value: "h",
    label: "Can several open at once?",
    content: "Yes, with multiple.",
  },
  {
    value: "i",
    label: "Does find in page work?",
    content: "Yes, with hiddenUntilFound.",
  },
  { value: "j", label: "Is there a tenth question?", content: "There is now." },
]

const variants: Variant[] = [
  {
    id: "single",
    section: "Modes",
    title: "Single",
    note: "Opening one item closes the other.",
  },
  {
    id: "default-open",
    section: "Modes",
    title: "Default value",
    options: { defaultValue: ["a"] },
  },
  {
    id: "not-collapsible",
    section: "Modes",
    title: "collapsible false",
    note: "One item always stays open. Its trigger is aria-disabled.",
    options: { collapsible: false, defaultValue: ["a"] },
  },
  {
    id: "multiple",
    section: "Modes",
    title: "Multiple",
    options: { multiple: true },
  },
  {
    id: "multiple-open",
    section: "Modes",
    title: "Multiple, several open",
    options: { multiple: true, defaultValue: ["a", "c"] },
  },
  {
    id: "many",
    section: "Modes",
    title: "Ten items",
    count: 10,
    options: { multiple: true },
  },

  {
    id: "item-disabled",
    section: "Disabled",
    title: "Disabled item",
    disabledItems: ["b"],
  },
  {
    id: "trigger-disabled",
    section: "Disabled",
    title: "Disabled trigger",
    disabledTriggers: ["b"],
  },
  {
    id: "root-disabled",
    section: "Disabled",
    title: "Disabled accordion",
    options: { disabled: true, defaultValue: ["a"] },
  },

  {
    id: "unmount",
    section: "Mounting",
    title: "Unmounted when closed",
    note: "The default.",
  },
  {
    id: "keep-mounted",
    section: "Mounting",
    title: "keepMounted",
    options: { keepMounted: true },
  },
  {
    id: "panel-keep-mounted",
    section: "Mounting",
    title: "keepMounted on one panel",
    panel: { keepMounted: true },
  },
  {
    id: "until-found",
    section: "Mounting",
    title: "hiddenUntilFound",
    note: "Find in page for “needle” opens the third item.",
    options: { hiddenUntilFound: true },
  },
  {
    id: "panel-until-found",
    section: "Mounting",
    title: "hiddenUntilFound on one panel",
    panel: { hiddenUntilFound: true },
  },

  {
    id: "animation-none",
    section: "Animation",
    title: "No animation",
    animation: "none",
  },
  {
    id: "animation-height",
    section: "Animation",
    title: "Height transition",
    animation: "height",
  },
  {
    id: "animation-slow",
    section: "Animation",
    title: "Slow, interrupt it",
    animation: "slow",
  },
  {
    id: "animation-keyframes",
    section: "Animation",
    title: "Keyframes",
    animation: "keyframes",
  },
  {
    id: "animation-keyframes-open",
    section: "Animation",
    title: "Keyframes, open at first",
    note: "The open panel must not animate on the first paint.",
    animation: "keyframes",
    options: { defaultValue: ["a"] },
  },
  {
    id: "animation-fade",
    section: "Animation",
    title: "Fade only",
    animation: "fade",
  },

  { id: "long", section: "Content", title: "Long panel", body: "long" },
  { id: "form", section: "Content", title: "Panel with a field", body: "form" },
  {
    id: "nested",
    section: "Content",
    title: "Nested accordion",
    body: "nested",
  },
  {
    id: "nested-deep",
    section: "Content",
    title: "Nested accordions, two levels",
    note: "Each nested item holds another accordion. Nested events are logged with their path.",
    body: "nested-deep",
  },
  {
    id: "grow",
    section: "Content",
    title: "Content that grows while open",
    note: "Open the second item and add lines. The panel follows.",
    body: "grow",
  },

  { id: "rtl", section: "Containers", title: "Right to left", place: "rtl" },
  {
    id: "scroll",
    section: "Containers",
    title: "Scroll container",
    place: "scroll",
  },
  {
    id: "transform",
    section: "Containers",
    title: "Scaled container",
    place: "transform",
  },
  { id: "row", section: "Containers", title: "In a flex row", place: "row" },

  {
    id: "controlled",
    section: "Behavior",
    title: "Controlled",
    controlled: true,
    options: { multiple: true },
  },
  {
    id: "controller",
    section: "Behavior",
    title: "Controller",
    controller: true,
    options: { multiple: true },
  },
  {
    id: "expand-all",
    section: "Behavior",
    title: "Expand all, collapse all",
    note: "controller.openAll() and controller.closeAll(). openAll needs multiple.",
    expandAll: true,
    count: 4,
    options: { multiple: true },
  },
  {
    id: "complete",
    section: "Behavior",
    title: "onOpenChangeComplete",
    note: "Each item logs once its slow animation has finished.",
    animation: "slow",
    options: { multiple: true },
  },
  {
    id: "index",
    section: "Behavior",
    title: "Item index",
    note: "React and Vue read index from render state. Web components show data-index. Reverse the items and the indexes follow.",
    index: true,
    count: 4,
  },
  {
    id: "cancel",
    section: "Behavior",
    title: "Cancel from onValueChange",
    note: "The second item never opens.",
    cancel: "b",
  },
  {
    id: "item-cancel",
    section: "Behavior",
    title: "Cancel from an item",
    note: "The second item's onOpenChange cancels.",
    itemCancel: "b",
  },
  {
    id: "debug",
    section: "Behavior",
    title: "debug",
    note: "Logs to the console.",
    options: { debug: true },
  },
]

export { items, type Variant, variants }
