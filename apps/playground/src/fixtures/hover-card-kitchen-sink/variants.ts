import type { Animation } from "./classes"

// Every scenario in the kitchen sink. Each framework renders the same list.
type Variant = {
  id: string
  section: string
  title: string
  note?: string
  // The link's text.
  trigger?: string
  options?: {
    defaultOpen?: boolean
    delay?: number
    closeDelay?: number
    disabled?: boolean
    debug?: boolean
  }
  content?: {
    side?: "top" | "right" | "bottom" | "left"
    align?: "start" | "center" | "end"
    sideOffset?: number
    alignOffset?: number
    collisionPadding?: number
    arrowPadding?: number
    keepMounted?: boolean
  }
  // What the card holds: a profile with links, plain text, long text, or a button with a tooltip.
  body?: "profile" | "text" | "long" | "tooltip"
  arrow?: boolean
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
  controlled?: boolean
  // Several links outside the card share it through a controller, each with a payload.
  controller?: boolean
}

const sides = ["top", "right", "bottom", "left"] as const
const aligns = ["start", "center", "end"] as const

// The payloads of the controller variant's links.
const authors = ["ada", "grace", "linus"]

const variants: Variant[] = [
  ...sides.flatMap((side) =>
    aligns.map((align) => ({
      id: `place-${side}-${align}`,
      section: "Placement",
      title: `${side} ${align}`,
      trigger: `@${side}-${align}`,
      body: "text" as const,
      content: { side, align },
    }))
  ),

  {
    id: "offset-0",
    section: "Offsets",
    title: "sideOffset 0",
    body: "text",
    content: { sideOffset: 0 },
  },
  {
    id: "offset-16",
    section: "Offsets",
    title: "sideOffset 16",
    body: "text",
    content: { sideOffset: 16 },
  },
  {
    id: "align-16",
    section: "Offsets",
    title: "alignOffset 16",
    body: "text",
    content: { align: "start", alignOffset: 16 },
  },
  {
    id: "align-neg",
    section: "Offsets",
    title: "alignOffset -16",
    body: "text",
    content: { align: "start", alignOffset: -16 },
  },
  {
    id: "padding-48",
    section: "Offsets",
    title: "collisionPadding 48",
    note: "Bottom-right corner. Stays 48px from the edges.",
    trigger: "↘ @padding",
    place: "bottom-right",
    content: { collisionPadding: 48 },
  },

  {
    id: "corner-tl",
    section: "Collisions",
    title: "Top-left corner, side top",
    note: "Flips below the link.",
    trigger: "↖ @corner",
    place: "top-left",
    content: { side: "top" },
  },
  {
    id: "corner-tr",
    section: "Collisions",
    title: "Top-right corner",
    note: "Shifts left to stay on screen. The arrow follows the link.",
    trigger: "↗ @corner",
    place: "top-right",
  },
  {
    id: "corner-bl",
    section: "Collisions",
    title: "Bottom-left corner",
    note: "Flips above the link.",
    trigger: "↙ @corner",
    place: "bottom-left",
  },
  {
    id: "long",
    section: "Collisions",
    title: "Long content",
    note: "Capped by --available-height. Scrolls.",
    body: "long",
  },

  { id: "arrow-none", section: "Arrow", title: "No arrow", arrow: false },
  {
    id: "arrow-padding",
    section: "Arrow",
    title: "arrowPadding 24, align start",
    note: "Keeps the arrow away from the corner.",
    trigger: "@a-rather-long-handle",
    content: { align: "start", arrowPadding: 24 },
  },
  {
    id: "arrow-clamped",
    section: "Arrow",
    title: "Clamped",
    note: "alignOffset pushes the card past the link. data-arrow-clamped is set.",
    content: { align: "start", alignOffset: 120 },
  },

  {
    id: "delay-0",
    section: "Delays",
    title: "delay 0",
    note: "Opens as the pointer arrives.",
    body: "text",
    options: { delay: 0 },
  },
  {
    id: "delay-default",
    section: "Delays",
    title: "delay 600",
    note: "The default. Focus waits for it too.",
    body: "text",
    options: { delay: 600 },
  },
  {
    id: "delay-long",
    section: "Delays",
    title: "delay 1500",
    body: "text",
    options: { delay: 1500 },
  },
  {
    id: "close-delay-0",
    section: "Delays",
    title: "closeDelay 0",
    note: "Closes as the pointer leaves, unless it crosses to the card.",
    body: "text",
    options: { closeDelay: 0 },
  },
  {
    id: "close-delay-default",
    section: "Delays",
    title: "closeDelay 300",
    note: "The default.",
    body: "text",
    options: { closeDelay: 300 },
  },
  {
    id: "close-delay-long",
    section: "Delays",
    title: "closeDelay 1000",
    body: "text",
    options: { closeDelay: 1000 },
  },

  {
    id: "profile",
    section: "Content",
    title: "Profile with links",
    note: "Tab from the link moves into the card. Focus inside keeps it open.",
    body: "profile",
  },
  {
    id: "text",
    section: "Content",
    title: "Text only",
    note: "Tab moves past the card.",
    body: "text",
  },
  {
    id: "tooltip",
    section: "Content",
    title: "Tooltip inside",
    note: "A button in the card has its own tooltip.",
    body: "tooltip",
  },

  {
    id: "disabled",
    section: "Behavior",
    title: "disabled",
    note: "Never opens. The link still works.",
    options: { disabled: true },
  },
  {
    id: "default-open",
    section: "Behavior",
    title: "defaultOpen",
    note: "Open on load.",
    body: "text",
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
    id: "portal",
    section: "Containers",
    title: "Portaled",
    note: "Tab order still follows the link.",
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
    note: "Positions against the dashed box, not the link.",
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
    note: "Three links share one card. Each passes its author as the payload.",
    controller: true,
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
  {
    id: "keep-mounted",
    section: "Animation",
    title: "keepMounted",
    note: "Stays in the page, hidden, while closed.",
    content: { keepMounted: true },
  },
]

export { authors, type Variant, variants }
