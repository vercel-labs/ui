// Shared by every framework's kitchen sink, so each renders the same thing.
const list = "flex flex-wrap items-center gap-1"
const link =
  "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-[13px] outline-none hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-neutral-400 aria-[current=page]:border aria-[current=page]:border-neutral-200 aria-[current=page]:font-medium"
const step =
  "inline-flex h-8 min-w-8 items-center justify-center gap-1 rounded-md px-2 text-[13px] outline-none hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-neutral-400 aria-disabled:pointer-events-none aria-disabled:opacity-50"
const ellipsis = "flex size-8 items-center justify-center text-neutral-500"
const control =
  "rounded border border-neutral-200 px-2 py-1 font-mono text-xs hover:bg-neutral-50"

export { control, ellipsis, link, list, step }
