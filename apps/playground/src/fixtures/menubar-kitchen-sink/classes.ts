// Shared by every framework's kitchen sink, so each renders the same thing.
const bar =
  "flex w-fit items-center gap-1 rounded-lg border border-neutral-200 bg-white p-1 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch"
const item =
  "inline-flex h-8 min-w-8 cursor-default items-center justify-center gap-1 rounded-md px-2 text-[13px] font-medium outline-none hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-neutral-400 data-open:bg-neutral-100 data-pressed:bg-neutral-200 data-disabled:cursor-not-allowed data-disabled:opacity-50"
const group = "flex gap-1 data-[orientation=vertical]:flex-col"
const separator =
  "mx-1 shrink-0 bg-neutral-200 data-[orientation=horizontal]:my-1 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-5 data-[orientation=vertical]:w-px"
const input =
  "h-8 w-20 rounded-md border border-neutral-200 px-2 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 data-disabled:opacity-50"
const popup =
  "min-w-40 rounded-lg border border-neutral-200 bg-white p-1 text-[13px] shadow-lg outline-none transition-[opacity,scale] duration-150 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0"
const menuItem =
  "flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 outline-none data-disabled:opacity-50 data-highlighted:bg-neutral-100 data-open:bg-neutral-100"
const control =
  "rounded border border-neutral-200 px-2 py-1 font-mono text-xs hover:bg-neutral-50"

export { bar, control, group, input, item, menuItem, popup, separator }
