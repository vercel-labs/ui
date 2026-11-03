// Tailwind classes shared by every framework. Handles switch on
// `aria-orientation`, the separator's own direction, like the registry's styles.
const classes = {
  group: "h-40 w-full rounded-md border border-neutral-200 data-disabled:opacity-60",
  nested: "h-full",
  panel:
    "flex items-center justify-center overflow-hidden text-xs text-neutral-600 data-collapsed:bg-neutral-100",
  handle:
    "relative w-px bg-neutral-200 outline-none after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:bg-blue-500 data-hovering:bg-neutral-400 data-dragging:bg-blue-500 aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full data-disabled:bg-neutral-100",
  row: "flex flex-wrap items-center gap-2",
  button: "rounded border border-neutral-300 px-2 py-0.5 text-xs hover:bg-neutral-50",
  transformed: "origin-left rotate-1 scale-90",
  scroll: "h-32 overflow-auto rounded border border-dashed border-neutral-300 p-2 [&>*]:h-60",
}

export { classes }
