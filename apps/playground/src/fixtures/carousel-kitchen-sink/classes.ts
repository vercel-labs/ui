// Shared by every framework's kitchen sink, so each renders the same thing.
const root = "grid w-full gap-2"
const viewport =
  "w-full rounded-md [scrollbar-width:none] data-[orientation=vertical]:h-56 data-dragging:cursor-grabbing"
const content = "gap-2 data-[orientation=vertical]:h-full"
const slide =
  "flex h-28 items-center justify-center rounded-md border border-neutral-200 bg-neutral-100 text-2xl font-semibold text-neutral-700 data-active:bg-neutral-200 data-[orientation=vertical]:h-56"
const controls = "flex items-center gap-2"
const step =
  "inline-flex h-8 items-center justify-center rounded-md border border-neutral-200 px-2.5 text-[13px] outline-none hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-neutral-400 aria-disabled:opacity-50"
const indicators = "ms-auto flex gap-1"
const indicator =
  "size-2.5 rounded-full bg-neutral-300 outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 aria-selected:bg-neutral-900"
const toggle =
  "inline-flex h-8 items-center rounded-md border border-neutral-200 px-2.5 text-[13px] outline-none hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-neutral-400"
const control =
  "rounded border border-neutral-200 px-2 py-1 font-mono text-xs hover:bg-neutral-50"

export {
  content,
  control,
  controls,
  indicator,
  indicators,
  root,
  slide,
  step,
  toggle,
  viewport,
}
