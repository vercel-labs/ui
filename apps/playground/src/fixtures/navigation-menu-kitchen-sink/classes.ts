import type { Variant } from "./variants"

type Animation = "none" | "slide" | "slow" | "move" | "reduced"

const root = "relative"
const list =
  "m-0 flex list-none items-center gap-1 p-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch"
const trigger =
  "group inline-flex h-8 items-center gap-1 rounded-md px-2.5 text-[13px] font-medium text-neutral-700 outline-none hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:opacity-40 disabled:hover:bg-transparent data-open:bg-neutral-100 data-open:text-neutral-950"
const chevron = "size-3 text-neutral-400 transition-transform duration-150 group-data-open:rotate-180"
const topLink =
  "inline-flex h-8 items-center rounded-md px-2.5 text-[13px] font-medium text-neutral-700 outline-none hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-neutral-400 data-current:text-neutral-950"

// Covers the open trigger, or the current page's link while closed: a bar
// under it when horizontal, beside it when vertical.
const indicator =
  "pointer-events-none absolute top-[calc(var(--active-item-top)+var(--active-item-height)+2px)] left-(--active-item-left) h-0.5 w-(--active-item-width) rounded-full bg-neutral-950 opacity-0 transition-[left,top,width,height,opacity] duration-200 data-visible:opacity-100 data-[orientation=vertical]:top-(--active-item-top) data-[orientation=vertical]:left-[calc(var(--active-item-left)-6px)] data-[orientation=vertical]:h-(--active-item-height) data-[orientation=vertical]:w-0.5 rtl:data-[orientation=vertical]:left-[calc(var(--active-item-left)+var(--active-item-width)+4px)] motion-reduce:transition-none"

// The viewport takes the open content's size. Contents sit at its corner.
const viewportBase =
  "overflow-hidden rounded-lg border border-neutral-200 bg-white text-[13px] text-neutral-950 shadow-lg outline-none w-(--viewport-width) h-(--viewport-height) origin-(--transform-origin) *:data-[slot=navigation-menu-content]:absolute *:data-[slot=navigation-menu-content]:top-0 *:data-[slot=navigation-menu-content]:start-0"

const viewportAnimations: Record<Animation, string> = {
  none: "",
  slide:
    "transition-[opacity,scale,width,height] duration-200 ease-out data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0",
  slow: "transition-[opacity,scale,width,height] duration-700 ease-out data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0",
  move: "transition-[opacity,scale,width,height,left,top] duration-300 ease-out data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0",
  reduced:
    "transition-[opacity,scale,width,height] duration-200 ease-out data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none",
}

function viewport(animation: Animation = "slide") {
  return `${viewportBase} ${viewportAnimations[animation]}`
}

// Contents slide in from the side of the item they replace, along the list.
const slides = {
  x: "data-[motion=from-end]:data-starting-style:translate-x-12 data-[motion=from-start]:data-starting-style:-translate-x-12 data-[motion=to-end]:data-ending-style:translate-x-12 data-[motion=to-start]:data-ending-style:-translate-x-12",
  "x-rtl":
    "data-[motion=from-end]:data-starting-style:-translate-x-12 data-[motion=from-start]:data-starting-style:translate-x-12 data-[motion=to-end]:data-ending-style:-translate-x-12 data-[motion=to-start]:data-ending-style:translate-x-12",
  y: "data-[motion=from-end]:data-starting-style:translate-y-8 data-[motion=from-start]:data-starting-style:-translate-y-8 data-[motion=to-end]:data-ending-style:translate-y-8 data-[motion=to-start]:data-ending-style:-translate-y-8",
}

const contentDurations: Record<Animation, string> = {
  none: "",
  slide: "duration-200",
  slow: "duration-700",
  move: "duration-300",
  reduced: "duration-200 motion-reduce:transition-none",
}

// Without a viewport, each content is a popup with its own frame.
const popupBase =
  "max-h-(--available-height) overflow-y-auto rounded-lg border border-neutral-200 bg-white text-[13px] text-neutral-950 shadow-lg outline-none origin-(--transform-origin)"
const popupAnimation =
  "transition-[opacity,scale] ease-out data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0"

// Each panel has its own width, so switching resizes the viewport.
const widths: Record<string, string> = {
  products: "w-[22rem]",
  resources: "w-56",
  company: "w-72",
  grown: "w-[28rem]",
  nested: "w-48",
}

function content(variant: Variant, item: string, grown = false) {
  const animation = variant.animation ?? "slide"
  const vertical = variant.options?.orientation === "vertical"
  const axis = vertical ? "y" : variant.place === "rtl" ? "x-rtl" : "x"
  const width = widths[grown ? "grown" : item]
  const long = variant.body === "long" && item === "products" ? "max-h-72 overflow-y-auto" : ""
  if (variant.viewport === false)
    return `${popupBase} ${width} p-3 ${animation === "none" ? "" : `${popupAnimation} ${contentDurations[animation]}`}`
  const motion =
    animation === "none"
      ? ""
      : `transition-[opacity,translate] ease-out data-starting-style:opacity-0 data-ending-style:opacity-0 ${slides[axis]} ${contentDurations[animation]}`
  return `${width} ${long} p-3 outline-none ${motion}`
}

// The nested menu's content is always a popup of its own.
const nestedContent = `${popupBase} ${widths.nested} p-2 ${popupAnimation} duration-150`

const links = "m-0 grid list-none gap-0.5 p-0"
const link =
  "block rounded-md px-2.5 py-2 text-neutral-950 no-underline outline-none hover:bg-neutral-100 focus-visible:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-neutral-400 data-current:bg-neutral-100"
const linkTitle = "block font-medium"
const linkDescription = "block text-xs text-neutral-500"
const more =
  "mt-2 h-7 rounded-md border border-neutral-200 px-2.5 text-xs font-medium outline-none hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-neutral-400"
const nestedRoot = "mt-2 border-t border-neutral-200 pt-2"

export {
  type Animation,
  chevron,
  content,
  indicator,
  link,
  linkDescription,
  links,
  linkTitle,
  list,
  more,
  nestedContent,
  nestedRoot,
  root,
  topLink,
  trigger,
  viewport,
  widths,
}
