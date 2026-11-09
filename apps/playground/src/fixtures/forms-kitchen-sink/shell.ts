import { variants, type Variant } from "./variants"

// The framework-neutral page: a card per variant with its props, a slot for the
// control, the last event and what the form would submit. Frameworks mount one
// variant into each slot.
function renderShell(
  root: HTMLElement,
  mount: (
    slot: HTMLElement,
    variant: Variant,
    log: (text: string) => void
  ) => void
) {
  root.innerHTML = ""
  const page = document.createElement("div")
  page.className =
    "mx-auto flex max-w-5xl flex-col gap-8 p-6 font-sans text-sm text-neutral-900"
  page.innerHTML = `<h1 class="text-xl font-semibold">Form controls kitchen sink</h1>`
  for (const section of [
    ...new Set(variants.map((variant) => variant.section)),
  ]) {
    const block = document.createElement("section")
    block.innerHTML = `<h2 class="mb-3 text-base font-semibold">${section}</h2>`
    const grid = document.createElement("div")
    grid.className = "grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
    for (const variant of variants.filter((item) => item.section === section)) {
      const card = document.createElement("div")
      card.className =
        "flex flex-col gap-2 rounded-lg border border-neutral-200 p-3"
      card.dataset.variant = variant.id
      const chips = Object.entries({ ...variant.options, ...variant.field })
        .map(
          ([key, value]) =>
            `<code class="rounded bg-neutral-100 px-1 text-xs">${key}=${JSON.stringify(value)}</code>`
        )
        .join(" ")
      card.innerHTML = `
        <div class="font-medium">${variant.title}</div>
        <div class="flex flex-wrap gap-1">${chips}</div>
        <div data-slot-host></div>
        <div class="text-xs text-neutral-500">Last event: <span data-log>none</span></div>
        <div class="text-xs text-neutral-500">Submitted: <span data-submitted>nothing yet</span></div>
      `
      grid.append(card)
      const log = (text: string) =>
        (card.querySelector("[data-log]")!.textContent = text)
      mount(card.querySelector<HTMLElement>("[data-slot-host]")!, variant, log)
      // Every variant sits in a form. Submitting shows what it would send.
      card.addEventListener("submit", (event) => {
        event.preventDefault()
        const form = event.target as HTMLFormElement
        const data = new URLSearchParams(
          new FormData(form) as unknown as Record<string, string>
        ).toString()
        card.querySelector("[data-submitted]")!.textContent = data || "(empty)"
      })
    }
    block.append(grid)
    page.append(block)
  }
  root.append(page)
}

// Tailwind classes shared by every framework.
const classes = {
  form: "flex flex-col items-start gap-2",
  row: "flex items-center gap-2",
  box: "inline-flex size-4 shrink-0 items-center justify-center rounded border border-neutral-400 bg-white outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 data-checked:border-neutral-900 data-checked:bg-neutral-900 data-indeterminate:border-neutral-900 data-indeterminate:bg-neutral-900 data-disabled:opacity-50 aria-invalid:border-red-500",
  indicator: "block size-2 rounded-[1px] bg-white data-indeterminate:h-0.5",
  animated:
    "transition-transform duration-200 data-starting-style:scale-0 data-ending-style:scale-0",
  kept: "opacity-0 data-checked:opacity-100 data-indeterminate:opacity-100",
  track:
    "inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-neutral-300 p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 data-checked:bg-neutral-900 data-disabled:opacity-50",
  thumb:
    "block size-4 rounded-full bg-white transition-transform data-checked:translate-x-4 rtl:data-checked:-translate-x-4",
  radio:
    "inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-neutral-400 bg-white outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 data-checked:border-neutral-900 data-disabled:opacity-50",
  dot: "block size-2 rounded-full bg-neutral-900",
  input:
    "h-8 rounded border border-neutral-300 px-2 data-invalid:border-red-500",
  error: "text-xs text-red-600",
  description: "text-xs text-neutral-500",
  button: "rounded border border-neutral-300 px-2 py-0.5 text-xs",
}

export { classes, renderShell }
