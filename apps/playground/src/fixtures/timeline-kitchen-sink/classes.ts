// Shared by every framework's kitchen sink, so each renders the same thing.
const root =
  "flex flex-col data-[orientation=horizontal]:flex-row data-busy:opacity-60"
const item =
  "relative grid grid-cols-[1rem_1fr] gap-x-3 pb-4 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 data-[orientation=horizontal]:w-40 data-[orientation=horizontal]:pe-4"
const marker =
  "col-start-1 row-start-1 mt-1 size-3 rounded-full border-2 border-neutral-300 data-complete:border-neutral-950 data-complete:bg-neutral-950 data-current:border-blue-600"
const connector =
  "absolute start-[5px] top-5 bottom-0 w-0.5 bg-neutral-200 data-complete:bg-neutral-950 data-[orientation=horizontal]:hidden"
const title =
  "col-start-2 text-[13px] font-medium data-upcoming:text-neutral-500"
const time = "col-start-2 text-xs text-neutral-500"
const description = "col-start-2 text-xs text-neutral-600"
const link = "col-start-2 text-xs text-blue-600 underline"
const control =
  "rounded border border-neutral-200 px-2 py-1 font-mono text-xs hover:bg-neutral-50"

export {
  connector,
  control,
  description,
  item,
  link,
  marker,
  root,
  time,
  title,
}
