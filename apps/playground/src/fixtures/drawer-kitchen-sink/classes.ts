import type { Variant } from "./variants"

const trigger =
  "inline-flex h-8 items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 text-[13px] font-medium text-neutral-950 shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 data-open:bg-neutral-100"

// The dim's opacity comes from the drawer, so this only gives it a color. A
// nested drawer's backdrop is lighter, since the parent's already dims the page.
const backdrop = "fixed inset-0 bg-black/20 data-nested:bg-black/10"

// The surface, by the edge it rests on. The drawer positions it, so there's no
// placement here. The sheet beneath a nested one scales back with --drawer-stack
// and moves away from its edge, so it peeks out above the one on top.
const surface =
  "group/drawer relative flex flex-col gap-3 bg-white px-4 pb-4 text-[13px] text-neutral-950 shadow-[0_0_24px_rgb(0_0_0/0.14)] outline-none [scale:calc(1-var(--drawer-stack)*0.06)] data-[side=bottom]:[top:calc(var(--drawer-stack)*-0.75rem)] data-[side=top]:[top:calc(var(--drawer-stack)*0.75rem)] data-[side=left]:[left:calc(var(--drawer-stack)*0.75rem)] data-[side=right]:[left:calc(var(--drawer-stack)*-0.75rem)] data-[side=bottom]:mx-auto data-[side=bottom]:w-full data-[side=bottom]:max-w-xl data-[side=bottom]:origin-top data-[side=bottom]:rounded-t-2xl data-[side=top]:mx-auto data-[side=top]:w-full data-[side=top]:max-w-xl data-[side=top]:origin-bottom data-[side=top]:rounded-b-2xl data-[side=top]:pt-4 data-[side=left]:origin-right data-[side=left]:pt-4 data-[side=left]:pe-8 data-[side=right]:origin-left data-[side=right]:pt-4 data-[side=right]:ps-8"

// Its own size up to nearly the screen; nearly the whole screen, which snap
// points reveal part of; or its content's size with no limit.
const sizes = {
  auto: "data-[side=bottom]:max-h-[calc(100dvh-3rem)] data-[side=top]:max-h-[calc(100dvh-3rem)] data-[side=left]:w-80 data-[side=left]:max-w-[calc(100vw-3rem)] data-[side=right]:w-80 data-[side=right]:max-w-[calc(100vw-3rem)]",
  full: "data-[side=bottom]:h-[calc(100dvh-3rem)] data-[side=top]:h-[calc(100dvh-3rem)] data-[side=left]:w-[calc(100vw-3rem)] data-[side=right]:w-[calc(100vw-3rem)]",
  unbounded: "data-[side=left]:w-80 data-[side=right]:w-80",
}

function content(size: Variant["size"] = "auto") {
  return `${surface} ${sizes[size]}`
}

// A pill on the edge facing the page: on top of a bottom drawer, below a top
// one, and down the inner side of a left or right one.
const handle =
  "mt-2 h-1.5 w-10 shrink-0 cursor-grab self-center rounded-full bg-neutral-300 outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 active:cursor-grabbing group-data-[side=top]/drawer:order-last group-data-[side=top]/drawer:mt-0 group-data-[side=left]/drawer:absolute group-data-[side=left]/drawer:top-1/2 group-data-[side=left]/drawer:right-2 group-data-[side=left]/drawer:mt-0 group-data-[side=left]/drawer:h-10 group-data-[side=left]/drawer:w-1.5 group-data-[side=left]/drawer:-translate-y-1/2 group-data-[side=right]/drawer:absolute group-data-[side=right]/drawer:top-1/2 group-data-[side=right]/drawer:left-2 group-data-[side=right]/drawer:mt-0 group-data-[side=right]/drawer:h-10 group-data-[side=right]/drawer:w-1.5 group-data-[side=right]/drawer:-translate-y-1/2"

const header = "flex flex-col gap-1"
const title = "text-base font-semibold"
const description = "text-neutral-500"
const actions = "flex flex-wrap justify-end gap-2"
const scroll =
  "-mx-4 min-h-0 flex-1 overflow-y-auto border-y border-neutral-100 px-4"
const scrollItem = "border-b border-neutral-100 py-2 last:border-0"
const field = "flex flex-col gap-1"
const input =
  "h-8 w-full rounded-md border border-neutral-200 px-2 outline-none focus:ring-2 focus:ring-neutral-300"
const textarea =
  "min-h-16 w-full rounded-md border border-neutral-200 px-2 py-1.5 outline-none focus:ring-2 focus:ring-neutral-300"
const button =
  "h-8 rounded-md border border-neutral-200 px-3 font-medium outline-none hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-neutral-400"
const primary =
  "h-8 rounded-md bg-neutral-950 px-3 font-medium text-white outline-none hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:opacity-60"
const snapButtons = "flex flex-wrap gap-2"

// The page behind, which an outlet makes follow the drawer.
const outlet =
  "flex h-16 w-full items-center justify-center rounded-md border border-neutral-200 bg-neutral-100 text-xs text-neutral-500"

export {
  actions,
  backdrop,
  button,
  content,
  description,
  field,
  handle,
  header,
  input,
  outlet,
  primary,
  scroll,
  scrollItem,
  snapButtons,
  textarea,
  title,
  trigger,
}
