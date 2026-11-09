import type {
  DrawerKeyframes,
  DrawerOptions,
  SnapPoint,
} from "@ui-sdk/core/drawer"

// The async Close action variants run: a second's wait that fails every other time.
let tries = 0
function flakyAction() {
  tries++
  return new Promise<void>((resolve, reject) =>
    setTimeout(
      () => (tries % 2 ? reject(new Error("Network error")) : resolve()),
      1000
    )
  )
}

// Every scenario in the kitchen sink. Each framework renders the same list.
type Variant = {
  id: string
  section: string
  title: string
  note?: string
  trigger?: string
  // Options passed to the root as they are. Callbacks are added by each framework.
  options?: Pick<
    DrawerOptions,
    | "side"
    | "snapPoints"
    | "defaultSnapPoint"
    | "modal"
    | "modalAbove"
    | "closeOnOutsidePress"
    | "dismissible"
    | "driver"
    | "expandOnScroll"
    | "physics"
    | "themeColor"
    | "preventEdgeSwipe"
  >
  content?: { keepMounted?: boolean }
  // What the drawer holds besides its title, description and Close part.
  body?: "text" | "scroll" | "form" | "tall" | "short" | "snap-buttons"
  // How big the sheet is: its own content's size up to nearly the screen, nearly the whole screen, which
  // snap points reveal part of, or its content's size with no limit.
  size?: "auto" | "full" | "unbounded"
  // Drawers opened from inside this one, each pushing back the one beneath.
  nested?: number
  // Where the drawer is declared.
  place?: "rtl" | "transform"
  portal?: boolean
  // Controls open, snapPoint or both from the card.
  controlled?: { open?: boolean; snapPoint?: boolean }
  // Refuses snap point changes to this one with details.cancel().
  refuseSnap?: SnapPoint
  // A controller the card's buttons drive.
  controller?: "open" | "await" | "snap"
  // A Close part that runs an async action, failing every other time.
  action?: boolean
  // A button on the page behind, which reports presses that reach it.
  pageButton?: boolean
  // An outlet that follows the drawer: outside it through the controller, or inside the root.
  outlet?: { keyframes: DrawerKeyframes; inside?: boolean }
  // Adds a theme-color meta tag to the page and logs what the drawer writes to it.
  themeMeta?: boolean
}

const fractions: SnapPoint[] = [0.25, 0.5, 1]

const variants: Variant[] = [
  { id: "bottom", section: "Sides", title: "bottom (default)" },
  { id: "top", section: "Sides", title: "top", options: { side: "top" } },
  { id: "left", section: "Sides", title: "left", options: { side: "left" } },
  { id: "right", section: "Sides", title: "right", options: { side: "right" } },
  {
    id: "start",
    section: "Sides",
    title: "start",
    note: "The left in left-to-right text.",
    options: { side: "start" },
  },
  {
    id: "end",
    section: "Sides",
    title: "end",
    note: "The right in left-to-right text.",
    options: { side: "end" },
  },
  {
    id: "start-rtl",
    section: "Sides",
    title: "start, right to left",
    note: "Declared under dir=rtl, so it comes from the right.",
    options: { side: "start" },
    place: "rtl",
  },
  {
    id: "end-rtl",
    section: "Sides",
    title: "end, right to left",
    note: "Declared under dir=rtl, so it comes from the left.",
    options: { side: "end" },
    place: "rtl",
  },
  {
    id: "top-snaps",
    section: "Sides",
    title: "top with snap points",
    note: "Drag down to expand. The handle steps.",
    options: { side: "top", snapPoints: [0.3, 0.7] },
    size: "full",
  },
  {
    id: "right-snaps",
    section: "Sides",
    title: "right with snap points",
    note: "Drag left to expand.",
    options: { side: "right", snapPoints: ["240px", 1] },
    size: "full",
  },

  {
    id: "snap-content",
    section: "Snap points",
    title: '"content" (default)',
    note: "Rests at its own size.",
  },
  {
    id: "snap-fractions",
    section: "Snap points",
    title: "Fractions",
    note: "A quarter, half and all of the screen.",
    options: { snapPoints: fractions },
    size: "full",
  },
  {
    id: "snap-px",
    section: "Snap points",
    title: "Pixels",
    note: "A number above 1 is pixels, like 160px.",
    options: { snapPoints: [160, "360px"] },
    size: "full",
  },
  {
    id: "snap-rem",
    section: "Snap points",
    title: "rem",
    options: { snapPoints: ["10rem", "24rem"] },
    size: "full",
  },
  {
    id: "snap-percent",
    section: "Snap points",
    title: "Percentages",
    note: "Of the screen.",
    options: { snapPoints: ["30%", "70%"] },
    size: "full",
  },
  {
    id: "snap-mixed",
    section: "Snap points",
    title: "Mixed units",
    options: { snapPoints: ["120px", 0.4, "20rem", "content"] },
    size: "full",
  },
  {
    id: "snap-duplicates",
    section: "Snap points",
    title: "Duplicates merge",
    note: "0.5 and 50% are one snap point, and so are 1 and content on a full sheet.",
    options: { snapPoints: [0.5, "50%", 1, "content"] },
    size: "full",
  },
  {
    id: "snap-too-large",
    section: "Snap points",
    title: "Larger than the content",
    note: "2000px caps at the sheet's own size.",
    options: { snapPoints: [100, 2000] },
  },
  {
    id: "snap-default",
    section: "Snap points",
    title: "defaultSnapPoint",
    note: "Opens at the half, every time.",
    options: { snapPoints: fractions, defaultSnapPoint: 0.5 },
    size: "full",
  },

  {
    id: "controlled-open",
    section: "Controlled",
    title: "open",
    note: "The checkbox drives it.",
    controlled: { open: true },
  },
  {
    id: "controlled-snap",
    section: "Controlled",
    title: "snapPoint",
    note: "The buttons inside set it. Drags report back.",
    options: { snapPoints: fractions },
    controlled: { snapPoint: true },
    body: "snap-buttons",
    size: "full",
  },
  {
    id: "controlled-both",
    section: "Controlled",
    title: "open and snapPoint",
    options: { snapPoints: fractions },
    controlled: { open: true, snapPoint: true },
    body: "snap-buttons",
    size: "full",
  },
  {
    id: "refuse-snap",
    section: "Controlled",
    title: "Canceling a snap change",
    note: "onSnapPointChange cancels moves to 1, so it springs back.",
    options: { snapPoints: fractions },
    refuseSnap: 1,
    body: "snap-buttons",
    size: "full",
  },

  {
    id: "dismissible-false",
    section: "Behavior",
    title: "dismissible false",
    note: "Escape, the backdrop and swipes resist, and each attempt is logged.",
    options: { dismissible: false },
  },
  {
    id: "dismissible-false-snaps",
    section: "Behavior",
    title: "dismissible false with snap points",
    note: "Swiping below the smallest one rubber-bands.",
    options: { dismissible: false, snapPoints: [0.3, 1] },
    size: "full",
  },
  {
    id: "non-modal",
    section: "Behavior",
    title: "modal false",
    note: "The page stays usable. Outside presses don't close it.",
    options: { modal: false },
    pageButton: true,
  },
  {
    id: "trap-focus",
    section: "Behavior",
    title: 'modal "trap-focus"',
    note: "Tab stays inside. The page scrolls and takes presses.",
    options: { modal: "trap-focus" },
    pageButton: true,
  },
  {
    id: "modal-above",
    section: "Behavior",
    title: "modalAbove",
    note: "At the smallest snap point the page is usable and undimmed. Drag up and it turns modal.",
    options: { snapPoints: [0.2, 0.6, 1], modalAbove: 0.2 },
    size: "full",
    pageButton: true,
  },
  {
    id: "outside-false",
    section: "Behavior",
    title: "closeOnOutsidePress false",
    note: "The backdrop does nothing. Escape still closes.",
    options: { closeOnOutsidePress: false },
  },
  {
    id: "expand-on-scroll-false",
    section: "Behavior",
    title: "expandOnScroll false",
    note: "Dragging the list scrolls it, at any snap point.",
    options: { snapPoints: [0.5, 1], expandOnScroll: false },
    body: "scroll",
    size: "full",
  },
  {
    id: "expand-on-scroll",
    section: "Behavior",
    title: "expandOnScroll (default)",
    note: "Dragging the list up expands the drawer first.",
    options: { snapPoints: [0.5, 1] },
    body: "scroll",
    size: "full",
  },
  {
    id: "keep-mounted",
    section: "Behavior",
    title: "keepMounted",
    content: { keepMounted: true },
  },

  {
    id: "scroll",
    section: "Content",
    title: "Scroll area",
    note: "A list that scrolls under a fixed header.",
    body: "scroll",
  },
  {
    id: "form",
    section: "Content",
    title: "Form",
    note: "Fields scroll into view above the keyboard.",
    body: "form",
  },
  {
    id: "tall",
    section: "Content",
    title: "Very tall",
    note: "Content taller than the screen, with no max-height.",
    body: "tall",
    size: "unbounded",
  },
  {
    id: "short",
    section: "Content",
    title: "Very short",
    note: "One line.",
    body: "short",
  },
  {
    id: "action",
    section: "Content",
    title: "Async Close action",
    note: "Save stays pending for a second. Every other try fails and stays open.",
    action: true,
  },

  {
    id: "nested-2",
    section: "Nesting",
    title: "Two levels",
    note: "The parent pushes back with --drawer-stack.",
    nested: 1,
  },
  { id: "nested-3", section: "Nesting", title: "Three levels", nested: 2 },
  {
    id: "nested-snaps",
    section: "Nesting",
    title: "Nested with snap points",
    options: { snapPoints: [0.5, 1] },
    size: "full",
    nested: 1,
  },

  {
    id: "driver-pointer",
    section: "Drivers",
    title: 'driver "pointer"',
    options: { driver: "pointer" },
  },
  {
    id: "driver-scroll-snap",
    section: "Drivers",
    title: 'driver "scroll-snap"',
    note: "Native scrolling moves it. Use a touch screen or a trackpad.",
    options: { driver: "scroll-snap", snapPoints: [0.3, 0.6, 1] },
    size: "full",
  },
  {
    id: "driver-scroll-snap-area",
    section: "Drivers",
    title: '"scroll-snap" with a scroll area',
    note: "The list scrolls once the drawer is at its largest.",
    options: { driver: "scroll-snap", snapPoints: [0.5, 1] },
    body: "scroll",
    size: "full",
  },
  {
    id: "driver-scroll-snap-side",
    section: "Drivers",
    title: '"scroll-snap" on the right',
    note: "Scroll snap moves bottom drawers only, so this one uses the pointer.",
    options: { driver: "scroll-snap", side: "right" },
  },

  {
    id: "outlet",
    section: "Effects",
    title: "Outlet with keyframes",
    note: "The panel above scales back as the drawer expands. Connected through the controller.",
    options: { snapPoints: [0.4, 1] },
    size: "full",
    outlet: { keyframes: { scale: [1, 0.94], borderRadius: ["0px", "16px"] } },
  },
  {
    id: "outlet-inside",
    section: "Effects",
    title: "Outlet inside the root",
    note: "Connected by context, no controller.",
    outlet: { keyframes: { opacity: [1, 0.4] }, inside: true },
  },
  {
    id: "theme-color",
    section: "Effects",
    title: "themeColor",
    note: "Dims the page's theme-color meta tag, logged at rest.",
    options: { themeColor: true, snapPoints: [0.4, 1] },
    size: "full",
    themeMeta: true,
  },
  {
    id: "edge-swipe",
    section: "Effects",
    title: "preventEdgeSwipe",
    note: "Keeps iOS Safari's back swipe from starting on the drawer.",
    options: { preventEdgeSwipe: true, side: "left" },
  },
  {
    id: "soft-spring",
    section: "Effects",
    title: "A soft spring",
    note: "Overshoots when it settles.",
    options: {
      physics: { response: 0.6, dampingRatio: 0.7 },
      snapPoints: fractions,
    },
    size: "full",
  },
  {
    id: "no-skipping",
    section: "Effects",
    title: "No skipping",
    note: "A fast fling stops at the next snap point.",
    options: {
      physics: { skipSnapPoints: false },
      snapPoints: [0.25, 0.5, 0.75, 1],
    },
    size: "full",
  },

  {
    id: "portal",
    section: "Containers",
    title: "container",
    note: "Renders into a container outside the card.",
    portal: true,
  },
  {
    id: "transform",
    section: "Containers",
    title: "Inside a transform",
    place: "transform",
  },
  {
    id: "transform-snaps",
    section: "Containers",
    title: "Inside a transform, with snap points",
    place: "transform",
    options: { snapPoints: [0.4, 1] },
    size: "full",
  },

  {
    id: "controller-open",
    section: "Controllers",
    title: "Open from outside",
    note: "The button opens it through createDrawerController().",
    controller: "open",
  },
  {
    id: "controller-await",
    section: "Controllers",
    title: "Await the result",
    note: "open() resolves when it closes, with the Close part's value.",
    controller: "await",
  },
  {
    id: "controller-snap",
    section: "Controllers",
    title: "setSnapPoint",
    note: "Set a snap point while closed and it opens there. The buttons inside move it.",
    options: { snapPoints: fractions },
    controller: "snap",
    body: "snap-buttons",
    size: "full",
  },
]

export { flakyAction, type Variant, variants }
