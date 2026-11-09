// Every scenario in the kitchen sink. Each framework renders the same list.
type Variant = {
  id: string
  section: "Layout" | "Paging" | "Rotation" | "State" | "Parts"
  title: string
  note?: string
  // Options passed as they are.
  options?: Record<string, unknown>
  // How many slides show at once. Ignored with `widths`.
  perView?: number
  // Slides of their own widths, in px, instead of `perView`.
  widths?: number[]
  // Slides narrower than the viewport, so the neighbors peek in.
  peek?: boolean
  place?: "rtl"
  controlled?: boolean
  controller?: boolean
  // Cancels every change from the change callback.
  cancel?: boolean
  // Renders the play toggle.
  toggle?: boolean
  // Previous, Next and the indicators sit outside the carousel and connect through a controller.
  outside?: boolean
  // Indicators are links to #kitchen-<id>-<page>.
  links?: boolean
}

const slideCount = 6

const variants: Variant[] = [
  {
    id: "default",
    section: "Layout",
    title: "Default",
    note: "One slide to a view.",
  },
  { id: "three", section: "Layout", title: "Three to a view", perView: 3 },
  {
    id: "peek",
    section: "Layout",
    title: "Peeking neighbors",
    peek: true,
    options: { align: "center" },
  },
  {
    id: "end",
    section: "Layout",
    title: "align end",
    perView: 2.5,
    options: { align: "end" },
  },
  {
    id: "vertical",
    section: "Layout",
    title: "Vertical",
    options: { orientation: "vertical" },
  },
  {
    id: "rtl",
    section: "Layout",
    title: "Right to left",
    place: "rtl",
    perView: 2,
  },
  {
    id: "widths",
    section: "Layout",
    title: "Slides of their own widths",
    widths: [120, 200, 90, 160, 220, 140],
    options: { slidesPerPage: "auto" },
  },
  {
    id: "per-page",
    section: "Paging",
    title: "slidesPerPage 2",
    perView: 2,
    options: { slidesPerPage: 2 },
  },
  {
    id: "auto",
    section: "Paging",
    title: "slidesPerPage auto",
    perView: 2.5,
    options: { slidesPerPage: "auto" },
  },
  { id: "loop", section: "Paging", title: "loop", options: { loop: true } },
  {
    id: "default-page",
    section: "Paging",
    title: "defaultPage 3",
    options: { defaultPage: 3 },
  },
  {
    id: "skip-snaps",
    section: "Paging",
    title: "skipSnaps",
    perView: 2,
    options: { skipSnaps: true },
  },
  {
    id: "drag-free",
    section: "Paging",
    title: "dragFree",
    perView: 2.5,
    options: { dragFree: true },
  },
  {
    id: "no-drag",
    section: "Paging",
    title: "drag false",
    note: "Only the parts move it.",
    options: { drag: false },
  },
  {
    id: "playing",
    section: "Rotation",
    title: "defaultPlaying",
    note: "Hover pauses it; keyboard focus stops it.",
    toggle: true,
    options: { defaultPlaying: true, interval: 2000 },
  },
  {
    id: "playing-loop",
    section: "Rotation",
    title: "Rotation with loop",
    toggle: true,
    perView: 2,
    options: { defaultPlaying: true, interval: 1500, loop: true },
  },
  {
    id: "stopped",
    section: "Rotation",
    title: "Play toggle, stopped",
    toggle: true,
    options: { interval: 1500 },
  },
  { id: "controlled", section: "State", title: "Controlled", controlled: true },
  { id: "controller", section: "State", title: "Controller", controller: true },
  { id: "cancel", section: "State", title: "Canceled changes", cancel: true },
  {
    id: "outside",
    section: "Parts",
    title: "Parts outside the carousel",
    outside: true,
  },
  { id: "links", section: "Parts", title: "Indicators as links", links: true },
]

// A slide's flex basis, from the variant's layout.
function slideBasis(variant: Variant, index: number) {
  if (variant.widths) {
    return `${variant.widths[index]}px`
  }
  if (variant.peek) {
    return "80%"
  }
  return `calc((100% - ${(variant.perView ?? 1) - 1} * 8px) / ${variant.perView ?? 1})`
}

export { slideBasis, slideCount, type Variant, variants }
