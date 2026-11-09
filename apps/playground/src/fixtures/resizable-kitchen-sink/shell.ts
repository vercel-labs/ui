import "./styles.css"
import { variants, type GroupSpec, type Variant } from "./variants"

type Log = {
  // The last layout change and its reason.
  change: (text: string) => void
  // The last completed change and its reason.
  commit: (text: string) => void
}

type Framework = "react" | "vue" | "web"

const frameworks: Record<Framework, string> = {
  react: "React",
  vue: "Vue",
  web: "Web Components",
}

/** A layout as the log shows it. */
const describe = (layout: number[]) =>
  layout.map((size) => Math.round(size)).join(" / ")

// The framework-neutral page: a card per variant with its props, a slot for
// the group, the last change and the last completed change. Frameworks mount
// one variant into each slot.
function renderShell(
  root: HTMLElement,
  framework: Framework,
  mount: (slot: HTMLElement, variant: Variant, log: Log) => void
) {
  document.title = `Resizable kitchen sink · ${frameworks[framework]}`
  root.className =
    "min-h-screen bg-neutral-50 font-sans text-sm text-neutral-950 antialiased"
  root.innerHTML = `
    <header class="sticky top-0 z-10 flex flex-wrap items-center gap-4 border-b border-neutral-200 bg-white/90 px-6 py-3 backdrop-blur">
      <h1 class="font-semibold">Resizable kitchen sink</h1>
      <nav class="flex gap-1 text-[13px]">${Object.entries(frameworks)
        .map(
          ([id, label]) =>
            `<a href="?fixture=resizable-kitchen-sink&framework=${id}" class="rounded-md px-2.5 py-1 ${
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
      "grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-3"
    for (const variant of variants.filter((item) => item.section === section)) {
      grid.append(card(variant, mount))
    }
    block.append(grid)
    main.append(block)
  }
}

function props(group: GroupSpec) {
  return {
    ...group.options,
    panels: group.panels.map((panel) => {
      const { label, nested, ...sizes } = panel
      return Object.keys(sizes).length
        ? `${label}(${JSON.stringify(sizes)})`
        : label
    }),
    ...(group.disabledHandles && { disabledHandles: group.disabledHandles }),
  }
}

function chips(variant: Variant) {
  const all = {
    ...props(variant.group),
    ...(variant.place && { place: variant.place }),
    ...(variant.controlled && { controlled: true }),
    ...(variant.controller && { controller: true }),
    ...(variant.conditional && { conditional: true }),
  }
  return Object.entries(all)
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
    <div data-slot-host class="flex flex-col gap-2"></div>
    <dl class="grid grid-cols-[auto_1fr] gap-x-2 text-xs text-neutral-500">
      <dt>Change</dt><dd data-change>none</dd>
      <dt>Complete</dt><dd data-commit>none</dd>
    </dl>
  `
  const write = (selector: string) => (text: string) =>
    (card.querySelector(selector)!.textContent = text)
  mount(card.querySelector<HTMLElement>("[data-slot-host]")!, variant, {
    change: write("[data-change]"),
    commit: write("[data-commit]"),
  })
  return card
}

// Which handles in a group are disabled.
const isHandleDisabled = (group: GroupSpec, index: number) =>
  !!group.disabledHandles?.includes(index)

export { describe, isHandleDisabled, type Log, renderShell }
