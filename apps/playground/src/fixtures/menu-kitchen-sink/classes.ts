const trigger =
  "inline-flex h-8 items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 text-[13px] font-medium text-neutral-950 shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 data-open:bg-neutral-100"

const animations = {
  none: "",
  default:
    "transition-[opacity,scale] duration-150 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0",
  slow: "transition-[opacity,scale,translate] duration-700 data-starting-style:-translate-y-2 data-starting-style:opacity-0 data-ending-style:translate-y-2 data-ending-style:opacity-0",
}

type Animation = keyof typeof animations

// The popup, for the menu and its submenus.
function content(animation: Animation = "default") {
  return `min-w-48 max-h-(--available-height) origin-(--transform-origin) overflow-y-auto rounded-lg border border-neutral-200 bg-white p-1 text-[13px] text-neutral-950 shadow-lg outline-none data-[presentation=sheet]:rounded-b-none data-[presentation=sheet]:p-2 **:data-[slot=menu-shortcut]:ms-auto **:data-[slot=menu-shortcut]:ps-6 **:data-[slot=menu-shortcut]:text-[11px] **:data-[slot=menu-shortcut]:text-neutral-500 ${animations[animation]}`
}

const item =
  "group flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 outline-none select-none data-highlighted:bg-neutral-100 data-disabled:opacity-40 data-open:bg-neutral-100"
const groupLabel = "px-2 pt-1.5 pb-0.5 text-[11px] font-medium text-neutral-500"
const separator = "-mx-1 my-1 h-px bg-neutral-200"
const indicator = "invisible w-3.5 group-data-checked:visible"
const chevron = "ms-auto text-neutral-400 rtl:rotate-180"

export {
  type Animation,
  chevron,
  content,
  groupLabel,
  indicator,
  item,
  separator,
  trigger,
}
