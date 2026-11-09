// Tailwind classes shared by every framework.
const classes = {
  form: "flex flex-col items-start gap-3",
  root: "flex flex-col items-start gap-1.5",
  group:
    "inline-flex h-8 items-stretch overflow-hidden rounded-md border border-neutral-300 bg-white focus-within:ring-2 focus-within:ring-neutral-400 data-disabled:opacity-50",
  input:
    "w-28 min-w-0 px-2 text-center tabular-nums outline-none data-invalid:text-red-600 read-only:bg-neutral-50",
  step: "w-8 border-neutral-300 text-neutral-700 select-none first:border-e last:border-s hover:bg-neutral-100 disabled:opacity-40",
  scrub:
    "cursor-ew-resize text-xs font-medium text-neutral-600 data-[orientation=vertical]:cursor-ns-resize data-disabled:cursor-default data-scrubbing:text-neutral-950",
  cursor: "z-50 -translate-x-1/2 -translate-y-1/2 text-base drop-shadow",
  row: "flex flex-wrap items-center gap-2",
  button:
    "rounded border border-neutral-300 px-2 py-0.5 text-xs hover:bg-neutral-50",
  label: "text-xs font-medium",
  description: "text-xs text-neutral-500",
  error: "text-xs text-red-600",
  transformed: "origin-left rotate-3 scale-90",
}

export { classes }
