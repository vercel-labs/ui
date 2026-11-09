const trigger =
  "shrink-0 rounded-sm text-[13px] font-medium text-neutral-950 underline decoration-neutral-300 underline-offset-4 outline-none hover:decoration-neutral-950 focus-visible:ring-2 focus-visible:ring-neutral-400 data-open:decoration-neutral-950"

const animations = {
  none: "",
  default:
    "transition-[opacity,scale] duration-150 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0",
  slow: "transition-[opacity,scale,translate] duration-700 data-starting-style:-translate-y-2 data-starting-style:opacity-0 data-ending-style:translate-y-2 data-ending-style:opacity-0",
}

type Animation = keyof typeof animations

// Only long content scrolls, since a scroller clips the arrow sticking out of it.
function content(animation: Animation = "default", scroll = false) {
  return `w-72 max-h-(--available-height) origin-(--transform-origin) ${scroll ? "overflow-y-auto" : ""} rounded-lg border border-neutral-200 bg-white p-4 text-[13px] text-neutral-950 shadow-lg outline-none ${animations[animation]}`
}

const arrow =
  "size-2.5 rotate-45 border-neutral-200 bg-white data-[side=bottom]:-top-[5px] data-[side=bottom]:border-t data-[side=bottom]:border-l data-[side=top]:-bottom-[5px] data-[side=top]:border-r data-[side=top]:border-b data-[side=left]:-right-[5px] data-[side=left]:border-t data-[side=left]:border-r data-[side=right]:-left-[5px] data-[side=right]:border-b data-[side=right]:border-l"
const avatar =
  "flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-600"
const name = "text-sm font-semibold"
const handle = "text-neutral-500"
const bio = "mt-2 text-neutral-600"
const link =
  "font-medium underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
const button =
  "h-8 rounded-md border border-neutral-200 px-3 font-medium outline-none hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-neutral-400"
const tooltip =
  "rounded-md bg-neutral-950 px-2 py-1 text-xs text-white shadow-md transition-opacity duration-150 data-instant:duration-0 data-starting-style:opacity-0 data-ending-style:opacity-0"
const anchor =
  "flex h-10 w-40 items-center justify-center rounded-md border border-dashed border-neutral-300 text-xs text-neutral-400"

export {
  anchor,
  type Animation,
  arrow,
  avatar,
  bio,
  button,
  content,
  handle,
  link,
  name,
  tooltip,
  trigger,
}
