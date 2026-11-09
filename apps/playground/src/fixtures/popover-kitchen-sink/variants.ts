import type { Animation } from "./classes"

// Every scenario in the kitchen sink. Each framework renders the same list.
type Variant = {
  id: string
  section: string
  title: string
  note?: string
  trigger?: string
  options?: {
    modal?: boolean | "trap-focus"
    openOnHover?: boolean
    delay?: number
    closeDelay?: number
    debug?: boolean
  }
  content?: {
    side?: "top" | "right" | "bottom" | "left"
    align?: "start" | "center" | "end"
    sideOffset?: number
    alignOffset?: number
    collisionPadding?: number
    arrowPadding?: number
    initialFocus?: "auto" | "content" | "none" | string
    finalFocus?: "trigger" | "none" | string
  }
  // What the popover holds.
  body?: "form" | "text" | "long" | "nested"
  arrow?: boolean
  // False leaves the title out, so the trigger names the popover.
  titled?: boolean
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
  controller?: boolean
}

const sides = ["top", "right", "bottom", "left"] as const
const aligns = ["start", "center", "end"] as const

const variants: Variant[] = [
  ...sides.flatMap((side) =>
    aligns.map((align) => ({
      id: `place-${side}-${align}`,
      section: "Placement",
      title: `${side} ${align}`,
      trigger: `${side} / ${align}`,
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
    trigger: "↘ padding 48",
    place: "bottom-right",
    content: { collisionPadding: 48 },
  },

  {
    id: "corner-tl",
    section: "Collisions",
    title: "Top-left corner",
    trigger: "↖",
    place: "top-left",
  },
  {
    id: "corner-tr",
    section: "Collisions",
    title: "Top-right corner",
    note: "Shifts left to stay on screen. The arrow follows the trigger.",
    trigger: "↗",
    place: "top-right",
  },
  {
    id: "corner-bl",
    section: "Collisions",
    title: "Bottom-left corner",
    note: "Flips above the trigger.",
    trigger: "↙",
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
    content: { align: "start", arrowPadding: 24 },
  },
  {
    id: "arrow-clamped",
    section: "Arrow",
    title: "Clamped",
    note: "alignOffset pushes the popover past the trigger. data-arrow-clamped is set.",
    content: { align: "start", alignOffset: 120 },
  },

  {
    id: "modal-false",
    section: "Modal",
    title: "modal false",
    note: "Default. Outside clicks close and reach what they hit. Tab out closes.",
    options: { modal: false },
  },
  {
    id: "modal-true",
    section: "Modal",
    title: "modal true",
    note: "Traps focus, locks scroll, the page is inert.",
    options: { modal: true },
  },
  {
    id: "modal-trap",
    section: "Modal",
    title: "modal trap-focus",
    note: "Traps focus. The page still scrolls and clicks.",
    options: { modal: "trap-focus" },
  },

  {
    id: "hover",
    section: "Hover",
    title: "openOnHover",
    note: "300ms delay. Pressing still opens it.",
    body: "text",
    options: { openOnHover: true },
  },
  {
    id: "hover-instant",
    section: "Hover",
    title: "delay 0, closeDelay 300",
    body: "text",
    options: { openOnHover: true, delay: 0, closeDelay: 300 },
  },
  {
    id: "hover-form",
    section: "Hover",
    title: "openOnHover with a form",
    note: "Tab from the trigger moves in and keeps it open.",
    options: { openOnHover: true, delay: 100 },
  },

  {
    id: "focus-content",
    section: "Focus",
    title: "initialFocus content",
    content: { initialFocus: "content" },
  },
  {
    id: "focus-none",
    section: "Focus",
    title: "initialFocus none",
    content: { initialFocus: "none" },
  },
  {
    id: "focus-selector",
    section: "Focus",
    title: "initialFocus selector",
    note: 'initialFocus="[data-save]" focuses Save.',
    content: { initialFocus: "[data-save]" },
  },
  {
    id: "final-none",
    section: "Focus",
    title: "finalFocus none",
    note: "Escape leaves focus on the page.",
    content: { finalFocus: "none" },
  },
  {
    id: "untitled",
    section: "Focus",
    title: "No title",
    note: "The trigger names it.",
    titled: false,
  },

  {
    id: "portal",
    section: "Containers",
    title: "Portaled",
    note: "Tab order still follows the trigger.",
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
    id: "nested",
    section: "Containers",
    title: "Nested popover",
    body: "nested",
  },

  {
    id: "controlled",
    section: "Behavior",
    title: "Controlled open",
    controlled: true,
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
    note: "Logs state changes.",
    options: { debug: true },
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

export { type Variant, variants }
