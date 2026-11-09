import { variants, type Variant } from "./variants"

// The framework-neutral page: a card per variant with its props, a slot for
// the component, the last event and what the form would submit. Frameworks
// mount one variant into each slot.
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
  page.innerHTML = `<h1 class="text-xl font-semibold">FileInput kitchen sink</h1>`
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
      const parts = ["trigger", "dropzone", "list"].filter(
        (part) => variant[part as keyof Variant]
      )
      const chips = [
        ...Object.entries(variant.props).map(
          ([key, value]) => `${key}=${JSON.stringify(value)}`
        ),
        ...parts,
      ]
        .map(
          (chip) =>
            `<code class="rounded bg-neutral-100 px-1 text-xs">${chip}</code>`
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
        const entries = [...new FormData(event.target as HTMLFormElement)].map(
          ([name, value]) =>
            `${name}=${typeof value === "string" ? value : value.name || "(empty file)"}`
        )
        card.querySelector("[data-submitted]")!.textContent =
          entries.join("&") || "(empty)"
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
  root: "flex w-full flex-col items-start gap-2",
  zone: "flex w-full flex-col items-start gap-2 rounded-lg border-2 border-dashed border-neutral-300 p-4 data-drag-accept:border-green-600 data-drag-accept:bg-green-50 data-drag-reject:border-red-600 data-drag-reject:bg-red-50 data-disabled:opacity-50",
  page: "pointer-events-none fixed inset-0 z-50 hidden place-items-center bg-neutral-900/80 text-lg text-white data-dragging:grid",
  button:
    "rounded border border-neutral-300 px-2 py-0.5 text-xs outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:opacity-50",
  list: "flex flex-wrap gap-1 empty:hidden",
  item: "flex items-center gap-1 rounded bg-neutral-100 py-0.5 ps-2 pe-1 text-xs outline-none focus-visible:ring-2 focus-visible:ring-neutral-400",
  remove: "rounded px-1 hover:bg-neutral-200 disabled:opacity-50",
  note: "h-14 w-full rounded border border-neutral-300 p-1",
  error: "text-xs text-red-600",
  description: "text-xs text-neutral-500",
}

export { classes, renderShell }
