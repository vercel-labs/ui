const trigger =
  "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 text-[13px] font-medium text-neutral-950 shadow-xs outline-none hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-neutral-400 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 data-open:bg-neutral-100"
const iconTrigger =
  "inline-flex size-8 items-center justify-center rounded-md border border-neutral-200 bg-white text-[13px] font-semibold text-neutral-950 shadow-xs outline-none hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-neutral-400"
const link =
  "text-[13px] font-medium text-neutral-950 underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
const toolbar =
  "inline-flex gap-0.5 rounded-lg border border-neutral-200 bg-white p-0.5 shadow-xs"
const toolbarButton =
  "inline-flex size-7 items-center justify-center rounded-md text-[13px] font-semibold text-neutral-950 outline-none hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-neutral-400"

// Tooltips that open at once, because another one was warm, skip the animation through data-instant.
const animations = {
  none: "",
  default:
    "transition-[opacity,scale] duration-150 data-instant:duration-0 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0",
  slow: "transition-[opacity,translate] duration-700 data-starting-style:translate-y-1 data-starting-style:opacity-0 data-ending-style:translate-y-1 data-ending-style:opacity-0",
}

type Animation = keyof typeof animations

function content(animation: Animation = "default") {
  return `max-w-64 origin-(--transform-origin) rounded-md bg-neutral-950 px-2 py-1 text-xs leading-5 text-white shadow-md ${animations[animation]}`
}

const arrow =
  "size-2 rotate-45 bg-neutral-950 data-[side=bottom]:-top-1 data-[side=left]:-right-1 data-[side=right]:-left-1 data-[side=top]:-bottom-1"
const shortcut = "ms-2 text-neutral-400"
const anchor =
  "flex h-10 w-40 items-center justify-center rounded-md border border-dashed border-neutral-300 text-xs text-neutral-400"

// For the variants composed with a popover.
const popover =
  "w-64 origin-(--transform-origin) rounded-lg border border-neutral-200 bg-white p-4 text-[13px] text-neutral-950 shadow-lg outline-none transition-[opacity,scale] duration-150 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0"
const popoverTitle = "mb-3 text-sm font-semibold"
const button =
  "h-8 rounded-md border border-neutral-200 px-3 text-[13px] font-medium outline-none hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-neutral-400"

export {
  anchor,
  type Animation,
  arrow,
  button,
  content,
  iconTrigger,
  link,
  popover,
  popoverTitle,
  shortcut,
  toolbar,
  toolbarButton,
  trigger,
}
