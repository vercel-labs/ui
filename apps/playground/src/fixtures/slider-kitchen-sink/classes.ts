// Tailwind classes shared by every framework. Vertical sliders switch on
// `data-orientation`, which every part carries.
const classes = {
  form: "flex flex-col items-stretch gap-3",
  root: "flex w-full flex-col gap-2 data-[orientation=vertical]:w-auto data-[orientation=vertical]:items-center",
  control:
    "flex w-full items-center py-2 data-[orientation=vertical]:h-40 data-[orientation=vertical]:w-auto data-[orientation=vertical]:px-2 data-[orientation=vertical]:py-0 data-disabled:opacity-50",
  track:
    "h-1.5 w-full rounded-full bg-neutral-200 data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
  indicator: "rounded-full bg-neutral-900",
  thumb:
    "size-4 rounded-full border border-neutral-900 bg-white shadow-sm transition-[scale] has-focus-visible:ring-2 has-focus-visible:ring-neutral-400 has-focus-visible:ring-offset-1 data-dragging:scale-125",
  bubble:
    "absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 rounded bg-neutral-900 px-1 text-[10px] text-white tabular-nums",
  value: "text-xs text-neutral-600 tabular-nums",
  row: "flex flex-wrap items-center gap-2",
  button:
    "rounded border border-neutral-300 px-2 py-0.5 text-xs hover:bg-neutral-50",
  label: "text-xs font-medium",
  description: "text-xs text-neutral-500",
  transformed: "origin-left rotate-3 scale-90",
}

export { classes }
