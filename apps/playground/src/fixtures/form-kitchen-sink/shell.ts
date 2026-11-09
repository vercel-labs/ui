import { variants, type Variant } from "./variants"

// The framework-neutral page: a card per variant with its props, a slot for
// the control and the last event. Frameworks mount one variant into each slot.
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
  page.innerHTML = `<h1 class="text-xl font-semibold">Text fields and forms kitchen sink</h1>`
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
      const props = {
        ...variant.options,
        ...(variant.invalid && { invalid: variant.invalid }),
        ...(variant.controlled && { controlled: true }),
      }
      const chips = Object.entries(props)
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
      `
      grid.append(card)
      const log = (text: string) =>
        (card.querySelector("[data-log]")!.textContent = text)
      mount(card.querySelector<HTMLElement>("[data-slot-host]")!, variant, log)
    }
    block.append(grid)
    page.append(block)
  }
  root.append(page)
}

// Tailwind classes shared by every framework.
const classes = {
  form: "flex flex-col items-start gap-2",
  field: "flex flex-col gap-1",
  label:
    "text-xs font-medium data-required:after:content-['*'] data-disabled:opacity-50",
  input:
    "h-8 w-56 rounded border border-neutral-300 px-2 data-filled:bg-neutral-50 data-invalid:border-red-500 disabled:opacity-50",
  textarea:
    "min-h-8 max-h-32 w-56 rounded border border-neutral-300 px-2 py-1 data-invalid:border-red-500 disabled:opacity-50",
  group:
    "flex h-8 w-56 items-center gap-1 rounded border border-neutral-300 px-2 data-disabled:opacity-50",
  groupInput: "h-full min-w-0 flex-1 outline-none",
  clear: "rounded px-1 text-neutral-500 hover:bg-neutral-100",
  set: "flex flex-col gap-2 rounded border border-neutral-200 p-2 data-disabled:opacity-60",
  legend: "text-xs font-semibold",
  error: "text-xs text-red-600",
  row: "flex gap-2",
  button: "rounded border border-neutral-300 px-2 py-0.5 text-xs",
}

export { classes, renderShell }
