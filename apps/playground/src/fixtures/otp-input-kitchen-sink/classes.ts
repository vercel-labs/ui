// Shared by every framework's kitchen sink, so each renders the same thing.
// `group/otp` lets the slots follow the input's `aria-invalid`.
const root = "group/otp flex w-fit items-center gap-2 data-disabled:opacity-50"
const group = "flex"
// The slot under the caret is active, and an empty active slot draws a blinking caret.
const slot =
  "relative flex h-10 w-9 items-center justify-center border-y border-e border-neutral-300 bg-white font-mono text-sm outline-none first:rounded-s-md first:border-s last:rounded-e-md data-active:z-10 data-active:ring-2 data-active:ring-neutral-900 data-fake-caret:after:absolute data-fake-caret:after:h-4 data-fake-caret:after:w-px data-fake-caret:after:animate-[caret-blink_1s_ease-out_infinite] data-fake-caret:after:bg-neutral-900 data-fake-caret:after:content-[''] group-has-[[aria-invalid=true]]/otp:border-red-400 group-has-[[aria-invalid=true]]/otp:bg-red-50 group-has-[[aria-invalid=true]]/otp:data-active:ring-red-500"
const separator = "px-0.5 text-neutral-400"
const form = "flex flex-col items-start gap-2"
const row = "flex gap-2"
const button =
  "rounded border border-neutral-300 px-2 py-0.5 text-xs hover:bg-neutral-50"
const control =
  "rounded border border-neutral-200 px-2 py-1 font-mono text-xs hover:bg-neutral-50"

export { button, control, form, group, root, row, separator, slot }
