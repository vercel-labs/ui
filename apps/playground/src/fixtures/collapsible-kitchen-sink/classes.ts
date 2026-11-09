const root = "w-full rounded-lg border border-neutral-200 bg-white"
const trigger =
  "group flex w-full cursor-default items-center justify-between gap-2 px-3 py-2.5 text-start text-[13px] font-medium outline-none hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-inset aria-disabled:cursor-not-allowed aria-disabled:opacity-60 aria-disabled:hover:bg-transparent"
const chevron =
  "text-neutral-400 transition-transform duration-200 group-data-open:rotate-180"
const inner = "flex flex-col gap-1 px-3 pb-3 text-[13px] text-neutral-600"
const input =
  "mt-2 h-8 w-full rounded-md border border-neutral-200 px-2 outline-none focus:ring-2 focus:ring-neutral-300"
const button =
  "rounded border border-neutral-200 px-2 py-1 text-xs hover:bg-neutral-50"

// The file tree.
const treeTrigger =
  "group flex w-full cursor-default items-center gap-1.5 rounded px-1.5 py-0.5 text-start text-[13px] outline-none hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-neutral-400"
const treeChevron =
  "w-3 text-neutral-400 transition-transform duration-150 group-data-open:rotate-90"
const treePanel =
  "h-(--collapsible-panel-height) overflow-hidden ps-4 transition-[height] duration-150 ease-out data-starting-style:h-0 data-ending-style:h-0"
const treeFile =
  "flex items-center gap-1.5 px-1.5 py-0.5 ps-6 text-[13px] text-neutral-600"

const height =
  "h-(--collapsible-panel-height) transition-[height] ease-out data-starting-style:h-0 data-ending-style:h-0"

const animations = {
  none: "",
  height: `${height} duration-200`,
  slow: `${height} duration-700`,
  keyframes: "ks-keyframes h-(--collapsible-panel-height)",
  infinite: `${height} duration-200 ks-infinite`,
  reduced: `${height} duration-500 motion-reduce:transition-none`,
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
  inner,
  input,
  panel,
  root,
  treeChevron,
  treeFile,
  treePanel,
  treeTrigger,
  trigger,
}
