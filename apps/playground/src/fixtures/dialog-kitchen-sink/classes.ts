const trigger =
  "inline-flex h-8 items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 text-[13px] font-medium text-neutral-950 shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 data-open:bg-neutral-100"

const animations = {
  none: { content: "", backdrop: "" },
  default: {
    content:
      "transition-[opacity,scale] duration-150 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0",
    backdrop:
      "transition-opacity duration-150 data-starting-style:opacity-0 data-ending-style:opacity-0",
  },
  slow: {
    content:
      "transition-[opacity,translate] duration-700 data-starting-style:translate-y-4 data-starting-style:opacity-0 data-ending-style:translate-y-4 data-ending-style:opacity-0",
    backdrop:
      "transition-opacity duration-700 data-starting-style:opacity-0 data-ending-style:opacity-0",
  },
}

type Animation = keyof typeof animations

// Centered in the viewport. A nested dialog sits a little lower, and its parent dims.
function content(animation: Animation = "default", pseudo = false) {
  return `fixed top-1/2 left-1/2 w-96 max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-neutral-200 bg-white p-6 text-[13px] text-neutral-950 shadow-xl outline-none data-nested:mt-6 data-nested-open:after:absolute data-nested-open:after:inset-0 data-nested-open:after:rounded-xl data-nested-open:after:bg-black/5 ${pseudo ? "backdrop:bg-black/40" : ""} ${animations[animation].content}`
}

function backdrop(animation: Animation = "default") {
  return `fixed inset-0 bg-black/40 data-nested:bg-transparent ${animations[animation].backdrop}`
}

const title = "mb-1 text-base font-semibold"
const description = "mb-4 text-neutral-500"
const input =
  "h-8 w-full rounded-md border border-neutral-200 px-2 outline-none focus:ring-2 focus:ring-neutral-300"
const button =
  "h-8 rounded-md border border-neutral-200 px-3 font-medium outline-none hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-neutral-400"
const danger =
  "h-8 rounded-md bg-red-600 px-3 font-medium text-white outline-none hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-300"

export {
  type Animation,
  backdrop,
  button,
  content,
  danger,
  description,
  input,
  title,
  trigger,
}
