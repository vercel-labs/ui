// Shared by every framework's kitchen sink, so each renders the same thing.
const root =
  "grid w-full grid-cols-[1fr_auto] items-center gap-x-2 gap-y-1.5 text-[13px]"
const label = "font-medium"
// Every part carries the status, so the value can color itself too.
const value =
  "text-xs text-neutral-500 tabular-nums data-complete:text-emerald-700"
const track =
  "relative col-span-2 h-2 w-full overflow-hidden rounded-full bg-neutral-200"
const progressIndicator =
  "block h-full rounded-full bg-neutral-900 transition-[width] duration-500 data-complete:bg-emerald-600 data-indeterminate:w-1/3 data-indeterminate:animate-[indeterminate_1.2s_ease-in-out_infinite]"
const control =
  "rounded border border-neutral-200 px-2 py-1 font-mono text-xs hover:bg-neutral-50"

export { control, label, progressIndicator, root, track, value }
