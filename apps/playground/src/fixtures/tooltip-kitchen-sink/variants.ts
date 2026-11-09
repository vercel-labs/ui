import type { Animation } from "./classes"

// Every scenario in the kitchen sink. Each framework renders the same list.
type Variant = {
  id: string
  section: string
  title: string
  note?: string
  // The trigger's text. Icon triggers show it as an aria-hidden glyph.
  trigger?: string
  // What the tooltip says.
  text?: string
  options?: {
    defaultOpen?: boolean
    delay?: number
    closeDelay?: number
    disabled?: boolean
    toggleable?: boolean
    closeOnPress?: boolean
    type?: "label" | "description"
    shortcut?: string
    debug?: boolean
  }
  content?: {
    side?: "top" | "right" | "bottom" | "left"
    align?: "start" | "center" | "end"
    sideOffset?: number
    alignOffset?: number
    collisionPadding?: number
    arrowPadding?: number
  }
  // A trigger with no text of its own, only an aria-hidden glyph.
  icon?: boolean
  // An aria-label on the trigger, so it has a name without the tooltip.
  label?: string
  // A trigger that looks disabled through aria-disabled and ignores presses.
  ariaDisabled?: boolean
  arrow?: boolean
  // A `TooltipShortcut` with its own keys, instead of the tooltip's.
  partShortcut?: string
  // The tooltip text changes after a press, like a copy button's.
  copy?: boolean
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
  // Composes the tooltip with something else.
  compose?: "toolbar" | "popover-trigger" | "in-popover" | "link"
  portal?: boolean
  controlled?: boolean
  // Several triggers outside the tooltip share it through a controller, each with a payload.
  controller?: boolean
}

const sides = ["top", "right", "bottom", "left"] as const
const aligns = ["start", "center", "end"] as const

// The toolbar's buttons, for the grouping variant.
const toolbar = [
  { icon: "B", text: "Bold", shortcut: "mod+b" },
  { icon: "I", text: "Italic", shortcut: "mod+i" },
  { icon: "U", text: "Underline", shortcut: "mod+u" },
  { icon: "S", text: "Strikethrough" },
]

// The payloads of the controller variant's triggers.
const rows = ["Inbox", "Drafts", "Archive"]

const variants: Variant[] = [
  ...sides.flatMap((side) =>
    aligns.map((align) => ({
      id: `place-${side}-${align}`,
      section: "Placement",
      title: `${side} ${align}`,
      trigger: `${side} / ${align}`,
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
    id: "offset-12",
    section: "Offsets",
    title: "sideOffset 12",
    content: { sideOffset: 12 },
  },
  {
    id: "align-16",
    section: "Offsets",
    title: "alignOffset 16",
    content: { align: "start", alignOffset: 16 },
  },
  {
    id: "align-neg",
    section: "Offsets",
    title: "alignOffset -16",
    content: { align: "start", alignOffset: -16 },
  },
  {
    id: "padding-48",
    section: "Offsets",
    title: "collisionPadding 48",
    note: "Bottom-right corner, side right. Stays 48px from the edges.",
    trigger: "↘ padding 48",
    place: "bottom-right",
    content: { side: "right", collisionPadding: 48 },
  },

  {
    id: "corner-tl",
    section: "Collisions",
    title: "Top-left corner",
    note: "Side top flips below the trigger.",
    trigger: "↖",
    place: "top-left",
  },
  {
    id: "corner-tr",
    section: "Collisions",
    title: "Top-right corner, side right",
    note: "Flips to the left. The arrow follows the trigger.",
    trigger: "↗",
    place: "top-right",
    content: { side: "right" },
  },
  {
    id: "corner-bl",
    section: "Collisions",
    title: "Bottom-left corner, side left",
    note: "Flips to the right.",
    trigger: "↙",
    place: "bottom-left",
    content: { side: "left" },
  },
  {
    id: "long",
    section: "Collisions",
    title: "Long text",
    note: "Wraps at the tooltip's max width.",
    text: "A long tooltip that wraps over several lines, because it explains something in more words than a tooltip should.",
  },

  { id: "arrow-none", section: "Arrow", title: "No arrow", arrow: false },
  {
    id: "arrow-padding",
    section: "Arrow",
    title: "arrowPadding 12, align start",
    note: "Keeps the arrow away from the corner.",
    trigger: "Wide trigger for the arrow",
    content: { align: "start", arrowPadding: 12 },
  },
  {
    id: "arrow-clamped",
    section: "Arrow",
    title: "Clamped",
    note: "alignOffset pushes the tooltip past the trigger. data-arrow-clamped is set.",
    content: { align: "start", alignOffset: 80 },
  },

  {
    id: "type-inferred-text",
    section: "Type",
    title: "Inferred: description",
    note: "The trigger has text, so the tooltip describes it.",
    trigger: "Save",
    text: "Saves to your account",
  },
  {
    id: "type-inferred-icon",
    section: "Type",
    title: "Inferred: label, icon only",
    note: "The trigger has no name, so the tooltip names it.",
    trigger: "✎",
    text: "Edit",
    icon: true,
  },
  {
    id: "type-aria-label",
    section: "Type",
    title: "Icon with aria-label",
    note: "The trigger has a name, so the tooltip describes it.",
    trigger: "⚙",
    text: "Opens the settings page",
    icon: true,
    label: "Settings",
  },
  {
    id: "type-label",
    section: "Type",
    title: "type label",
    note: "Names the trigger, replacing its text.",
    trigger: "⌫",
    text: "Delete",
    options: { type: "label" },
  },
  {
    id: "type-description",
    section: "Type",
    title: "type description",
    note: "Describes an icon button that has no name.",
    trigger: "★",
    text: "Adds to favorites",
    icon: true,
    options: { type: "description" },
  },

  {
    id: "shortcut",
    section: "Shortcut",
    title: "shortcut mod+s",
    note: "⌘S on Apple platforms, Ctrl+S elsewhere. The trigger gets aria-keyshortcuts.",
    trigger: "Save",
    text: "Save",
    options: { shortcut: "mod+s" },
  },
  {
    id: "shortcut-shift",
    section: "Shortcut",
    title: "shortcut mod+shift+p",
    trigger: "⌘",
    text: "Command palette",
    icon: true,
    options: { shortcut: "mod+shift+p" },
  },
  {
    id: "shortcut-part",
    section: "Shortcut",
    title: "TooltipShortcut shortcut alt+enter",
    note: "The part shows its own keys. The trigger gets no aria-keyshortcuts.",
    trigger: "Send",
    text: "Send",
    partShortcut: "alt+enter",
  },

  {
    id: "disabled",
    section: "Behavior",
    title: "disabled",
    note: "Never opens. The trigger still works.",
    options: { disabled: true },
  },
  {
    id: "aria-disabled",
    section: "Behavior",
    title: "aria-disabled trigger",
    note: "Looks disabled and ignores presses, but keyboard users still reach it.",
    trigger: "Publish",
    text: "Add a title to publish",
    ariaDisabled: true,
  },
  {
    id: "toggleable",
    section: "Behavior",
    title: "toggleable",
    note: "Pressing opens and closes it, for touch. A press announces the text.",
    trigger: "i",
    text: "Billing runs on the first of the month.",
    label: "About billing",
    icon: true,
    options: { toggleable: true },
  },
  {
    id: "close-on-press",
    section: "Behavior",
    title: "closeOnPress true",
    note: "Default. A press closes it until the pointer leaves.",
  },
  {
    id: "close-on-press-false",
    section: "Behavior",
    title: "closeOnPress false",
    note: "Pressing copies, and the tooltip turns into Copied.",
    trigger: "Copy link",
    text: "Copy to clipboard",
    copy: true,
    options: { closeOnPress: false },
  },
  {
    id: "default-open",
    section: "Behavior",
    title: "defaultOpen",
    note: "Open on load, until another tooltip opens.",
    options: { defaultOpen: true },
  },
  {
    id: "debug",
    section: "Behavior",
    title: "debug",
    note: "Logs state changes.",
    options: { debug: true },
  },

  {
    id: "delay-0",
    section: "Delays",
    title: "delay 0",
    note: "Opens as the pointer arrives.",
    options: { delay: 0 },
  },
  {
    id: "delay-default",
    section: "Delays",
    title: "delay 600",
    note: "The default. Instant while another tooltip is warm.",
    options: { delay: 600 },
  },
  {
    id: "delay-long",
    section: "Delays",
    title: "delay 1500",
    options: { delay: 1500 },
  },
  {
    id: "close-delay",
    section: "Delays",
    title: "closeDelay 500",
    note: "Lingers after the pointer leaves.",
    options: { closeDelay: 500 },
  },

  {
    id: "toolbar",
    section: "Composition",
    title: "Toolbar group",
    note: "One tooltip each. Once one shows, the next opens at once with data-instant.",
    compose: "toolbar",
    options: { delay: 600 },
  },
  {
    id: "popover-trigger",
    section: "Composition",
    title: "On a popover trigger",
    note: "Hover shows the tooltip. Pressing opens the popover and closes it.",
    trigger: "Profile",
    text: "Edit your profile",
    compose: "popover-trigger",
  },
  {
    id: "in-popover",
    section: "Composition",
    title: "Inside a popover",
    note: "Escape closes the tooltip first, then the popover.",
    trigger: "Open popover",
    compose: "in-popover",
  },
  {
    id: "link",
    section: "Composition",
    title: "On a link",
    text: "Opens the docs",
    trigger: "Documentation",
    compose: "link",
  },

  {
    id: "portal",
    section: "Containers",
    title: "Portaled",
    note: "Renders in a container at the end of the page.",
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
    content: { align: "start" },
  },
  {
    id: "anchor",
    section: "Containers",
    title: "Custom anchor",
    note: "Positions against the dashed box, not the trigger.",
    anchor: true,
  },

  {
    id: "controlled",
    section: "State",
    title: "Controlled open",
    controlled: true,
  },
  {
    id: "controller",
    section: "State",
    title: "Controller with payloads",
    note: "Three triggers share one tooltip. Each passes its row as the payload.",
    controller: true,
  },

  { id: "anim-none", section: "Animation", title: "None", animation: "none" },
  {
    id: "anim-default",
    section: "Animation",
    title: "Scale and fade",
    note: "Skipped with data-instant.",
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

export { rows, toolbar, type Variant, variants }
