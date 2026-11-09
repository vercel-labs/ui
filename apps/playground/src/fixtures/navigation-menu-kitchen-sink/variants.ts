import type { Animation } from "./classes"

type Placement = {
  side?: "top" | "right" | "bottom" | "left" | "start" | "end"
  align?: "start" | "center" | "end"
  sideOffset?: number
  alignOffset?: number
  collisionPadding?: number
}

// Every scenario in the kitchen sink. Each framework renders the same list.
type Variant = {
  id: string
  section: string
  title: string
  note?: string
  options?: {
    defaultValue?: string
    delay?: number
    closeDelay?: number
    openOnHover?: boolean
    closeOnSelect?: boolean
    orientation?: "horizontal" | "vertical"
    debug?: boolean
  }
  // Placement of the shared viewport. Without one, every content is its own popup.
  viewport?: Placement | false
  // Placement of each content, used when there's no viewport.
  content?: Placement & { keepMounted?: boolean; hiddenUntilFound?: boolean }
  // What the first panel holds besides its links: a nested menu, a long list, or links added while open.
  body?: "links" | "nested" | "long" | "dynamic"
  // Positions the viewport, or each content, against the whole navigation instead of the open trigger.
  anchorNav?: boolean
  // The item whose trigger is disabled.
  disabled?: string
  // Gives each panel's first link `closeOnSelect`, the opposite of the menu's.
  linkCloseOnSelect?: boolean
  // Whether the top-level "Pricing" link is the current page.
  activeLink?: boolean
  animation?: Animation
  // Where the navigation sits.
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
  // The open item lives in the card's state, with a select outside the menu.
  controlled?: boolean
  controller?: boolean
}

type Item = {
  value: string
  label: string
  links: { label: string; description: string }[]
}

// The items every navigation renders. Their panels have different sizes, so
// switching between them resizes the viewport.
const items: Item[] = [
  {
    value: "products",
    label: "Products",
    links: [
      { label: "Analytics", description: "Charts for every metric." },
      { label: "Engagement", description: "Reach people where they are." },
      { label: "Security", description: "Keep data safe." },
      { label: "Integrations", description: "Connect the tools you use." },
    ],
  },
  {
    value: "resources",
    label: "Resources",
    links: [
      { label: "Blog", description: "News and guides." },
      { label: "Guides", description: "Step by step." },
    ],
  },
  {
    value: "company",
    label: "Company",
    links: [
      { label: "About", description: "Who we are." },
      { label: "Careers", description: "Join the team." },
      { label: "Press", description: "Logos and contacts." },
    ],
  },
]

// The links of the menu nested in the first panel.
const nestedLinks = ["Tutorials", "Courses", "Webinars"]

// The links the dynamic panel adds while open.
const moreLinks = ["Changelog", "Roadmap", "Status"]

// Every link's href, unique per variant so a press doesn't scroll the page anywhere.
const href = (variant: Variant, label: string) =>
  `#${variant.id}-${label.toLowerCase()}`

// Whether the variant renders a viewport.
const hasViewport = (variant: Variant) => variant.viewport !== false

const sides = ["bottom", "top", "left", "right"] as const
const aligns = ["start", "center", "end"] as const

const variants: Variant[] = [
  ...sides.flatMap((side) =>
    aligns.map((align) => ({
      id: `place-${side}-${align}`,
      section: "Viewport placement",
      title: `side ${side}, align ${align}`,
      viewport: { side, align },
    }))
  ),

  {
    id: "offset-0",
    section: "Viewport offsets",
    title: "sideOffset 0",
    viewport: { sideOffset: 0 },
  },
  {
    id: "offset-16",
    section: "Viewport offsets",
    title: "sideOffset 16",
    viewport: { sideOffset: 16 },
  },
  {
    id: "align-16",
    section: "Viewport offsets",
    title: "alignOffset 16",
    viewport: { alignOffset: 16 },
  },
  {
    id: "align-neg",
    section: "Viewport offsets",
    title: "alignOffset -16",
    viewport: { alignOffset: -16 },
  },
  {
    id: "anchor-nav",
    section: "Viewport offsets",
    title: "Anchored to the whole nav",
    note: "Every panel opens at the same spot, under the start of the nav.",
    anchorNav: true,
  },
  {
    id: "anchor-nav-center",
    section: "Viewport offsets",
    title: "Anchored to the nav, centered",
    note: "Panels of different widths stay centered under the nav.",
    anchorNav: true,
    viewport: { align: "center" },
  },
  {
    id: "anchor-nav-top",
    section: "Viewport offsets",
    title: "Anchored to the nav, side top",
    anchorNav: true,
    viewport: { side: "top", sideOffset: 8 },
  },

  {
    id: "corner-tl",
    section: "Collisions",
    title: "Top-left corner, side top",
    note: "Flips below the trigger.",
    place: "top-left",
    viewport: { side: "top" },
  },
  {
    id: "corner-tr",
    section: "Collisions",
    title: "Top-right corner, side right",
    note: "No room on the right: flips to the left of the trigger.",
    place: "top-right",
    viewport: { side: "right" },
  },
  {
    id: "corner-tr-end",
    section: "Collisions",
    title: "Top-right corner, Company",
    note: "Open Company, the last item: its panel shifts left to stay on screen.",
    place: "top-right",
  },
  {
    id: "corner-bl",
    section: "Collisions",
    title: "Bottom of the window",
    note: "Flips above the trigger.",
    place: "bottom-left",
  },
  {
    id: "padding-48",
    section: "Collisions",
    title: "collisionPadding 48",
    note: "Bottom-right corner. Stays 48px from the edges.",
    place: "bottom-right",
    viewport: { collisionPadding: 48 },
  },

  {
    id: "popup",
    section: "Without a viewport",
    title: "Contents as popups",
    note: "Each content is its own popup, positioned against its trigger.",
    viewport: false,
  },
  {
    id: "popup-top",
    section: "Without a viewport",
    title: "side top",
    viewport: false,
    content: { side: "top" },
  },
  {
    id: "popup-right-center",
    section: "Without a viewport",
    title: "side right, align center",
    viewport: false,
    content: { side: "right", align: "center" },
  },
  {
    id: "popup-end",
    section: "Without a viewport",
    title: "align end",
    viewport: false,
    content: { align: "end" },
  },
  {
    id: "popup-offsets",
    section: "Without a viewport",
    title: "sideOffset 12, alignOffset 8",
    viewport: false,
    content: { sideOffset: 12, alignOffset: 8 },
  },
  {
    id: "popup-anchor-nav",
    section: "Without a viewport",
    title: "Anchored to the whole nav",
    viewport: false,
    anchorNav: true,
  },
  {
    id: "popup-corner-tr",
    section: "Without a viewport",
    title: "Top-right corner, side right",
    note: "Flips to the left.",
    viewport: false,
    place: "top-right",
    content: { side: "right" },
  },
  {
    id: "popup-corner-bl",
    section: "Without a viewport",
    title: "Bottom of the window",
    note: "Flips above.",
    viewport: false,
    place: "bottom-left",
  },

  {
    id: "vertical",
    section: "Orientation",
    title: "Vertical",
    note: "The viewport opens at the inline end. Up and Down move between items.",
    options: { orientation: "vertical" },
  },
  {
    id: "vertical-popup",
    section: "Orientation",
    title: "Vertical without a viewport",
    options: { orientation: "vertical" },
    viewport: false,
  },
  {
    id: "vertical-start",
    section: "Orientation",
    title: "Vertical, side start",
    note: "Little room at the start, so it may flip to the end.",
    options: { orientation: "vertical" },
    viewport: { side: "start" },
  },
  {
    id: "vertical-center",
    section: "Orientation",
    title: "Vertical, align center",
    options: { orientation: "vertical" },
    viewport: { align: "center" },
  },

  {
    id: "rtl",
    section: "Right to left",
    title: "Right to left",
    note: "Opens under the trigger's right edge. Left and Right swap.",
    place: "rtl",
  },
  {
    id: "rtl-popup",
    section: "Right to left",
    title: "Without a viewport",
    place: "rtl",
    viewport: false,
  },
  {
    id: "rtl-end",
    section: "Right to left",
    title: "align end",
    place: "rtl",
    viewport: { align: "end" },
  },
  {
    id: "rtl-vertical",
    section: "Right to left",
    title: "Vertical",
    note: "The inline end is on the left.",
    place: "rtl",
    options: { orientation: "vertical" },
  },

  {
    id: "delay-0",
    section: "Behavior",
    title: "delay 0",
    note: "Opens as the pointer arrives.",
    options: { delay: 0 },
  },
  {
    id: "delay-500",
    section: "Behavior",
    title: "delay 500",
    options: { delay: 500 },
  },
  {
    id: "close-delay-0",
    section: "Behavior",
    title: "closeDelay 0",
    note: "Closes as the pointer leaves, unless it crosses to the panel.",
    options: { closeDelay: 0 },
  },
  {
    id: "close-delay-600",
    section: "Behavior",
    title: "closeDelay 600",
    options: { closeDelay: 600 },
  },
  {
    id: "click-only",
    section: "Behavior",
    title: "openOnHover false",
    note: "Only a press opens a panel.",
    options: { openOnHover: false },
  },
  {
    id: "stay-open",
    section: "Behavior",
    title: "closeOnSelect false",
    note: "Links keep the menu open, except each panel's first link, which sets closeOnSelect.",
    options: { closeOnSelect: false },
    linkCloseOnSelect: true,
  },
  {
    id: "link-stays",
    section: "Behavior",
    title: "Link closeOnSelect false",
    note: "Each panel's first link keeps the menu open. The others close it.",
    linkCloseOnSelect: true,
  },
  {
    id: "disabled",
    section: "Behavior",
    title: "Disabled trigger",
    note: "Products never opens. Arrow keys skip it.",
    disabled: "products",
  },
  {
    id: "default-value",
    section: "Behavior",
    title: "defaultValue",
    note: "Products is open on load.",
    options: { defaultValue: "products" },
  },
  {
    id: "controlled",
    section: "Behavior",
    title: "Controlled value",
    note: "The select and the menu share one value.",
    controlled: true,
  },
  {
    id: "controller",
    section: "Behavior",
    title: "Controller",
    note: "The buttons drive the menu from outside it.",
    controller: true,
  },
  {
    id: "debug",
    section: "Behavior",
    title: "debug",
    note: "Logs state changes.",
    options: { debug: true },
  },

  {
    id: "keep-mounted",
    section: "Content",
    title: "keepMounted",
    note: "Closed panels stay in their items, hidden.",
    content: { keepMounted: true },
  },
  {
    id: "keep-mounted-popup",
    section: "Content",
    title: "keepMounted without a viewport",
    viewport: false,
    content: { keepMounted: true },
  },
  {
    id: "until-found",
    section: "Content",
    title: "hiddenUntilFound",
    note: "Find “Integrations” in the page to open Products.",
    content: { hiddenUntilFound: true },
  },
  {
    id: "until-found-popup",
    section: "Content",
    title: "hiddenUntilFound without a viewport",
    viewport: false,
    content: { hiddenUntilFound: true },
  },
  {
    id: "nested",
    section: "Content",
    title: "Nested submenu",
    note: "Products holds a vertical menu, “Learn”, which opens its own popup.",
    body: "nested",
  },
  {
    id: "nested-popup",
    section: "Content",
    title: "Nested submenu without a viewport",
    viewport: false,
    body: "nested",
  },
  {
    id: "long",
    section: "Content",
    title: "Long content",
    note: "Products scrolls inside a capped height.",
    body: "long",
  },
  {
    id: "long-popup",
    section: "Content",
    title: "Long content without a viewport",
    note: "Capped by --available-height.",
    viewport: false,
    body: "long",
  },
  {
    id: "dynamic",
    section: "Content",
    title: "Content that grows while open",
    note: "Show more adds links and widens Products. The viewport follows.",
    body: "dynamic",
  },
  {
    id: "dynamic-popup",
    section: "Content",
    title: "Content that grows, without a viewport",
    viewport: false,
    body: "dynamic",
  },

  {
    id: "portal",
    section: "Containers",
    title: "Portaled",
    note: "The viewport renders into a container outside the card.",
    portal: true,
  },
  {
    id: "portal-popup",
    section: "Containers",
    title: "Portaled without a viewport",
    portal: true,
    viewport: false,
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
    id: "clip-popup",
    section: "Containers",
    title: "Inside overflow hidden, without a viewport",
    place: "clip",
    viewport: false,
  },
  {
    id: "transform",
    section: "Containers",
    title: "Inside a transform",
    place: "transform",
  },
  {
    id: "transform-popup",
    section: "Containers",
    title: "Inside a transform, without a viewport",
    place: "transform",
    viewport: false,
  },

  { id: "anim-none", section: "Animation", title: "None", animation: "none" },
  {
    id: "anim-slide",
    section: "Animation",
    title: "Slide between panels",
    note: "Contents slide by data-motion. The viewport fades and resizes.",
    animation: "slide",
  },
  {
    id: "anim-slow",
    section: "Animation",
    title: "Slow slide",
    note: "700ms.",
    animation: "slow",
  },
  {
    id: "anim-slow-top",
    section: "Animation",
    title: "Slow, side top",
    note: "Scales from its bottom edge.",
    animation: "slow",
    viewport: { side: "top" },
  },
  {
    id: "anim-move",
    section: "Animation",
    title: "Size and position",
    note: "The viewport also moves between triggers with left and top transitions.",
    animation: "move",
  },
  {
    id: "anim-reduced",
    section: "Animation",
    title: "Reduced motion",
    note: "Slides, unless the system asks for reduced motion.",
    animation: "reduced",
  },
  {
    id: "anim-popup",
    section: "Animation",
    title: "Without a viewport",
    note: "Each popup scales and fades.",
    viewport: false,
    animation: "slide",
  },

  {
    id: "indicator",
    section: "Indicator",
    title: "Indicator",
    note: "Covers the open trigger, and Pricing, the current page, while closed.",
    activeLink: true,
  },
  {
    id: "indicator-none",
    section: "Indicator",
    title: "No current page",
    note: "Hidden while closed, since no link is the current page.",
    activeLink: false,
  },
  {
    id: "indicator-vertical",
    section: "Indicator",
    title: "Vertical",
    options: { orientation: "vertical" },
    activeLink: true,
  },
  {
    id: "indicator-rtl",
    section: "Indicator",
    title: "Right to left",
    place: "rtl",
    activeLink: true,
  },
]

export {
  hasViewport,
  href,
  type Item,
  items,
  moreLinks,
  nestedLinks,
  type Variant,
  variants,
}
