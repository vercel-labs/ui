import "./styles.css"
import { variants, type Variant } from "./variants"

type Log = {
  // The last value change and its reason.
  change: (text: string) => void
  // The last commit and its reason.
  commit: (text: string) => void
}

type Framework = "react" | "vue" | "web"

const frameworks: Record<Framework, string> = {
  react: "React",
  vue: "Vue",
  web: "Web Components",
}

// The framework-neutral page: a card per variant with its props, a slot for
// the slider, the last change, the last commit and what the form submitted.
// Frameworks mount one variant into each slot.
function renderShell(
  root: HTMLElement,
  framework: Framework,
  mount: (slot: HTMLElement, variant: Variant, log: Log) => void
) {
  document.title = `Slider kitchen sink · ${frameworks[framework]}`
  root.className =
    "min-h-screen bg-neutral-50 font-sans text-sm text-neutral-950 antialiased"
  root.innerHTML = `
    <header class="sticky top-0 z-10 flex flex-wrap items-center gap-4 border-b border-neutral-200 bg-white/90 px-6 py-3 backdrop-blur">
      <h1 class="font-semibold">Slider kitchen sink</h1>
      <nav class="flex gap-1 text-[13px]">${Object.entries(frameworks)
        .map(
          ([id, label]) =>
            `<a href="?fixture=slider-kitchen-sink&framework=${id}" class="rounded-md px-2.5 py-1 ${
              id === framework
                ? "bg-neutral-950 text-white"
                : "text-neutral-600 hover:bg-neutral-100"
            }">${label}</a>`
        )
        .join("")}</nav>
      <span class="ms-auto text-xs text-neutral-500">${variants.length} variants</span>
    </header>
    <main class="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-8"></main>
  `
  const main = root.querySelector("main")!
  for (const section of [
    ...new Set(variants.map((variant) => variant.section)),
  ]) {
    const block = document.createElement("section")
    block.innerHTML = `<h2 class="mb-3 text-xs font-semibold tracking-wide text-neutral-500 uppercase">${section}</h2>`
    const grid = document.createElement("div")
    grid.className =
      "grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3"
    for (const variant of variants.filter((item) => item.section === section)) {
      grid.append(card(variant, mount))
    }
    block.append(grid)
    main.append(block)
  }
}

function chips(variant: Variant) {
  const props = {
    ...variant.options,
    ...(variant.format && { format: variant.format }),
    ...(variant.place && { place: variant.place }),
    ...(variant.controlled && { controlled: true }),
    ...(variant.controller && { controller: true }),
  }
  return Object.entries(props)
    .map(
      ([key, value]) =>
        `<code class="rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] text-neutral-600">${key}=${JSON.stringify(value)}</code>`
    )
    .join("")
}

function card(
  variant: Variant,
  mount: (slot: HTMLElement, variant: Variant, log: Log) => void
) {
  const card = document.createElement("div")
  card.className =
    "flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-4"
  card.dataset.variant = variant.id
  card.innerHTML = `
    <div class="font-medium">${variant.title}</div>
    <div class="flex flex-wrap gap-1">${chips(variant)}</div>
    <div data-slot-host></div>
    <dl class="grid grid-cols-[auto_1fr] gap-x-2 text-xs text-neutral-500">
      <dt>Change</dt><dd data-change>none</dd>
      <dt>Commit</dt><dd data-commit>none</dd>
      <dt>Submitted</dt><dd data-submitted>nothing yet</dd>
    </dl>
  `
  const write = (selector: string) => (text: string) =>
    (card.querySelector(selector)!.textContent = text)
  mount(card.querySelector<HTMLElement>("[data-slot-host]")!, variant, {
    change: write("[data-change]"),
    commit: write("[data-commit]"),
  })
  // Every variant sits in a form. Submitting shows what it would send.
  card.addEventListener("submit", (event) => {
    event.preventDefault()
    const form = event.target as HTMLFormElement
    const data = new URLSearchParams(
      new FormData(form) as unknown as Record<string, string>
    ).toString()
    write("[data-submitted]")(data || "(empty)")
  })
  return card
}

export { type Log, renderShell }
