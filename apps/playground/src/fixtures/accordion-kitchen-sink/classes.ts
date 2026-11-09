const root =
  "w-full divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white"
const item = "data-[disabled]:opacity-60"
const header = "m-0 text-[13px] font-medium"
const trigger =
  "group flex w-full items-center justify-between gap-2 px-3 py-2.5 text-start outline-none hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-inset aria-disabled:cursor-not-allowed aria-disabled:hover:bg-transparent"
const chevron =
  "text-neutral-400 transition-transform duration-200 group-data-open:rotate-180"
const inner = "px-3 pb-3 text-[13px] text-neutral-600"
const button =
  "rounded border border-neutral-200 px-2 py-1 text-xs hover:bg-neutral-50"
const index = "ms-auto font-mono text-[11px] text-neutral-400"
// Web components show the item's data-index attribute instead of render state.
const itemIndex =
  "relative before:absolute before:end-9 before:top-3 before:font-mono before:text-[11px] before:text-neutral-400 before:content-['#'_attr(data-index)]"
const input =
  "mt-2 h-8 w-full rounded-md border border-neutral-200 px-2 outline-none focus:ring-2 focus:ring-neutral-300"

const animations = {
  none: "",
  height:
    "h-(--accordion-panel-height) transition-[height] duration-200 ease-out data-starting-style:h-0 data-ending-style:h-0",
  slow: "h-(--accordion-panel-height) transition-[height] duration-700 ease-out data-starting-style:h-0 data-ending-style:h-0",
  keyframes: "ks-keyframes h-(--accordion-panel-height)",
  fade: "transition-opacity duration-300 data-starting-style:opacity-0 data-ending-style:opacity-0",
}

type Animation = keyof typeof animations

function panel(animation: Animation = "height") {
  return `overflow-hidden ${animations[animation]}`
}

export {
  type Animation,
  button,
  chevron,
  header,
  index,
  inner,
  input,
  item,
  itemIndex,
  panel,
  root,
  trigger,
}
