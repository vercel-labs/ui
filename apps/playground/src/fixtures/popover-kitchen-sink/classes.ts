const trigger =
  "inline-flex h-8 items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 text-[13px] font-medium text-neutral-950 shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 data-open:bg-neutral-100"

const animations = {
  none: "",
  default:
    "transition-[opacity,scale] duration-150 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0",
  slow: "transition-[opacity,scale,translate] duration-700 data-starting-style:-translate-y-2 data-starting-style:opacity-0 data-ending-style:translate-y-2 data-ending-style:opacity-0",
}

type Animation = keyof typeof animations

function content(animation: Animation = "default") {
  return `w-64 max-h-(--available-height) origin-(--transform-origin) overflow-y-auto rounded-lg border border-neutral-200 bg-white p-4 text-[13px] text-neutral-950 shadow-lg outline-none ${animations[animation]}`
}

const arrow =
  "size-2.5 rotate-45 border-neutral-200 bg-white data-[side=bottom]:-top-[5px] data-[side=bottom]:border-t data-[side=bottom]:border-l data-[side=top]:-bottom-[5px] data-[side=top]:border-r data-[side=top]:border-b data-[side=left]:-right-[5px] data-[side=left]:border-t data-[side=left]:border-r data-[side=right]:-left-[5px] data-[side=right]:border-b data-[side=right]:border-l"
const title = "mb-1 text-sm font-semibold"
const description = "mb-3 text-neutral-500"
const input =
  "h-8 w-full rounded-md border border-neutral-200 px-2 outline-none focus:ring-2 focus:ring-neutral-300"
const button =
  "h-8 rounded-md border border-neutral-200 px-3 font-medium outline-none hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-neutral-400"
const anchor =
  "flex h-10 w-40 items-center justify-center rounded-md border border-dashed border-neutral-300 text-xs text-neutral-400"

export {
  anchor,
  type Animation,
  arrow,
  button,
  content,
  description,
  input,
  title,
  trigger,
}
