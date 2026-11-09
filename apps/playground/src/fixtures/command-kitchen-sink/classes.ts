// The box around the field and the list. Inline, so it sits in its card.
const root =
  "flex w-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white text-[13px] text-neutral-950 shadow-xs focus-within:ring-2 focus-within:ring-neutral-300 data-loading:opacity-80"

const input =
  "h-9 w-full border-b border-neutral-200 bg-transparent px-3 text-[13px] text-neutral-950 outline-none placeholder:text-neutral-400"

const list = "max-h-56 overflow-y-auto p-1 empty:hidden"

const item =
  "relative flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 outline-none select-none data-disabled:opacity-40 data-highlighted:bg-neutral-100 data-pending:animate-pulse data-pending:text-neutral-400"
const shortcut = "ms-auto text-[11px] tracking-wide text-neutral-400"
const pending = "ms-auto text-[11px] text-neutral-400"
const error = "ms-auto text-[11px] text-red-600"
const empty = "px-3 py-3 text-center text-neutral-500 empty:hidden"
const status = "px-3 py-1 text-[11px] text-neutral-400 empty:hidden"
const groupLabel = "px-2 pt-1.5 pb-0.5 text-[11px] font-medium text-neutral-500"
const separator = "-mx-1 my-1 h-px bg-neutral-200"
const breadcrumb =
  "flex items-center gap-1 border-b border-neutral-200 px-3 py-1 text-[11px] text-neutral-500"
const button =
  "h-7 rounded-md border border-neutral-200 px-2 text-xs outline-none hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-neutral-400"

const trigger =
  "inline-flex h-8 items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 text-[13px] font-medium text-neutral-950 shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 data-open:bg-neutral-100"
const dialogBackdrop =
  "fixed inset-0 z-40 bg-black/40 transition-opacity duration-150 data-starting-style:opacity-0 data-ending-style:opacity-0"
const dialogContent =
  "fixed top-24 left-1/2 z-50 w-[32rem] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-xl border border-neutral-200 bg-white p-0 shadow-xl outline-none transition-[opacity,scale] duration-150 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0"
const dialogRoot =
  "flex w-full flex-col overflow-hidden rounded-xl text-[13px] text-neutral-950"

export {
  breadcrumb,
  button,
  dialogBackdrop,
  dialogContent,
  dialogRoot,
  empty,
  error,
  groupLabel,
  input,
  item,
  list,
  pending,
  root,
  separator,
  shortcut,
  status,
  trigger,
}
