// Shared by every framework's kitchen sink, so each renders the same thing.
const root =
  "relative h-48 w-full overflow-hidden rounded-md border border-neutral-200 bg-white"
const viewport =
  "size-full rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
const content = "p-3 text-[13px]"
const scrollbar =
  "flex touch-none p-px opacity-0 transition-opacity duration-150 select-none data-visible:opacity-100 data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col data-[orientation=vertical]:w-2.5"
const thumb =
  "flex-1 rounded-full bg-neutral-300 hover:bg-neutral-400 data-dragging:bg-neutral-500"
const corner = "bg-neutral-100"
const jump =
  "absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs shadow-sm opacity-0 transition-opacity data-visible:opacity-100"
const fade =
  "pointer-events-none absolute inset-x-0 h-6 from-white to-transparent opacity-0 transition-opacity"
const control =
  "rounded border border-neutral-200 px-2 py-1 font-mono text-xs hover:bg-neutral-50"

export {
  content,
  control,
  corner,
  fade,
  jump,
  root,
  scrollbar,
  thumb,
  viewport,
}
