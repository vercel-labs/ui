// Shared by every framework's kitchen sink, so each renders the same thing.
// The ring shows the status: amber while loading, green once loaded, red when it failed.
const avatar =
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-100 font-medium text-neutral-600 ring-2 ring-transparent ring-offset-2 select-none data-[loading-status=error]:ring-red-300 data-[loading-status=loaded]:ring-emerald-300 data-[loading-status=loading]:ring-amber-300"
const sizes = {
  sm: "size-6 text-[10px]",
  md: "size-10 text-sm",
  lg: "size-16 text-lg",
}
const image = "size-full object-cover"
// The fallback carries the status too, so a failed image tints it.
const fallback =
  "flex size-full items-center justify-center bg-neutral-200 data-[loading-status=error]:bg-red-50 data-[loading-status=error]:text-red-700"
const customImage =
  "size-full object-cover outline-2 -outline-offset-2 outline-dashed outline-neutral-900"
const group = "flex items-center -space-x-1 rtl:space-x-reverse"
const control =
  "rounded border border-neutral-200 px-2 py-1 font-mono text-xs hover:bg-neutral-50"

export { avatar, control, customImage, fallback, group, image, sizes }
