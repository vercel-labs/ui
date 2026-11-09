// Shared by every framework's kitchen sink, so each renders the same thing.
const toggle =
  "inline-flex h-8 min-w-8 cursor-default items-center justify-center gap-1 rounded-md px-2 text-[13px] font-medium outline-none hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-neutral-400 data-pressed:bg-neutral-200 data-disabled:cursor-not-allowed data-disabled:opacity-50"
const group =
  "inline-flex w-fit gap-1 rounded-lg border border-neutral-200 p-1 data-[orientation=vertical]:flex-col"
const button =
  "inline-flex h-8 w-fit items-center justify-center gap-2 rounded-md bg-neutral-900 px-3 text-[13px] font-medium text-white outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-pending:cursor-progress data-pending:opacity-70"
const separator =
  "shrink-0 bg-neutral-200 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-6 data-[orientation=vertical]:w-px"
const control =
  "rounded border border-neutral-200 px-2 py-1 font-mono text-xs hover:bg-neutral-50"
// Around a separator, by its orientation.
const row = "flex h-6 items-center gap-3 text-[13px]"
const column = "flex w-full flex-col gap-2 text-[13px]"

export { button, column, control, group, row, separator, toggle }
