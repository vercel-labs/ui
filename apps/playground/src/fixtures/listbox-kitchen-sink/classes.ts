// Shared by every framework's kitchen sink, so each renders the same thing.
const root =
  "flex max-h-60 w-56 flex-col gap-0.5 overflow-y-auto rounded-lg border border-neutral-200 bg-white p-1 text-[13px] outline-none data-disabled:opacity-50 data-[orientation=horizontal]:w-auto data-[orientation=horizontal]:flex-row"
const item =
  "flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 outline-none select-none focus-visible:ring-2 focus-visible:ring-neutral-400 data-disabled:opacity-40 data-highlighted:bg-neutral-100 data-selected:font-medium"
const indicator = "ms-auto text-neutral-950"
const icon = "size-3.5 shrink-0 text-neutral-500"
const group = "flex flex-col gap-0.5"
const groupLabel = "px-2 pt-2 pb-1 text-[11px] font-medium text-neutral-500"
const separator = "my-1 h-px shrink-0 bg-neutral-200"
const button =
  "inline-flex h-8 items-center rounded-md bg-neutral-900 px-3 text-[13px] font-medium text-white"
const label = "text-[13px] font-medium"
const description = "text-xs text-neutral-500"
const control =
  "rounded border border-neutral-200 px-2 py-1 font-mono text-xs hover:bg-neutral-50"

export {
  button,
  control,
  description,
  group,
  groupLabel,
  icon,
  indicator,
  item,
  label,
  root,
  separator,
}
