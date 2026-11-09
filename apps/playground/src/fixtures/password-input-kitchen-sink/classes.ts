// Shared by every framework's kitchen sink, so each renders the same thing.
const root =
  "group flex h-9 w-64 items-center rounded-md border border-neutral-200 bg-white ps-3 text-[13px] focus-within:ring-2 focus-within:ring-neutral-400 data-disabled:opacity-50"
const input =
  "h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-neutral-400"
const toggle =
  "inline-flex size-9 shrink-0 items-center justify-center rounded-e-md text-neutral-500 outline-none hover:text-neutral-950 focus-visible:ring-2 focus-visible:ring-neutral-400 aria-pressed:text-neutral-950 data-disabled:pointer-events-none"
const capsLock = "hidden text-xs text-amber-700 group-has-data-capslock:block"
const button =
  "inline-flex h-8 items-center rounded-md bg-neutral-900 px-3 text-[13px] font-medium text-white"
const label = "text-[13px] font-medium"
const description = "text-xs text-neutral-500"
const control =
  "rounded border border-neutral-200 px-2 py-1 font-mono text-xs hover:bg-neutral-50"

export { button, capsLock, control, description, input, label, root, toggle }
