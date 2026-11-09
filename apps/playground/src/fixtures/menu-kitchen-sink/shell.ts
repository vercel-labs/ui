import { createMenuController, type MenuController } from "@ui-sdk/core/menu"
import "./styles.css"
import type { Variant } from "./variants"
import { variants } from "./variants"

type Env = {
  log: (message: string) => void
  controller?: MenuController
  // Set for portaled variants.
  container?: HTMLElement
}

type Framework = "react" | "vue" | "web"

const frameworks: Record<Framework, string> = {
  react: "React",
  vue: "Vue",
  web: "Web Components",
}

// Builds the page in plain DOM and asks the framework to mount one menu per card.
function kitchenSink(
  root: HTMLElement,
  framework: Framework,
  mount: (slot: HTMLElement, variant: Variant, env: Env) => void
) {
  document.title = `Kitchen sink · ${frameworks[framework]}`
  root.className =
    "min-h-screen bg-neutral-50 pb-80 font-sans text-neutral-950 antialiased"
  root.innerHTML = `
    <header class="sticky top-0 z-10 flex flex-wrap items-center gap-4 border-b border-neutral-200 bg-white/90 px-6 py-3 backdrop-blur">
      <h1 class="text-sm font-semibold">Menu kitchen sink</h1>
      <nav class="flex gap-1 text-[13px]">
        ${Object.entries(frameworks)
          .map(
            ([id, label]) =>
              `<a href="?fixture=menu-kitchen-sink&framework=${id}" class="rounded-md px-2.5 py-1 ${
                id === framework
                  ? "bg-neutral-950 text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }">${label}</a>`
          )
          .join("")}
      </nav>
      <span class="ms-auto text-xs text-neutral-500">${variants.length} variants · every event is logged below</span>
    </header>
    <main class="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-8"></main>
    <aside class="fixed right-4 bottom-4 z-20 flex w-96 flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg">
      <div class="flex items-center border-b border-neutral-200 px-3 py-2 text-xs font-medium">
        Events
        <button data-clear class="ms-auto text-neutral-500 hover:text-neutral-950">Clear</button>
      </div>
      <ol data-log class="h-56 overflow-y-auto px-3 py-2 font-mono text-[11px] leading-5 text-neutral-600"></ol>
    </aside>
  `
  const main = root.querySelector("main")!
  const logList = root.querySelector<HTMLOListElement>("[data-log]")!
  root
    .querySelector("[data-clear]")!
    .addEventListener("click", () => logList.replaceChildren())

  const sections = new Map<string, HTMLElement>()
  for (const variant of variants) {
    let grid = sections.get(variant.section)
    if (!grid) {
      const section = document.createElement("section")
      section.innerHTML = `<h2 class="mb-3 text-xs font-semibold tracking-wide text-neutral-500 uppercase">${variant.section}</h2>`
      grid = document.createElement("div")
      grid.className =
        "grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3"
      section.append(grid)
      main.append(section)
      sections.set(variant.section, grid)
    }
    grid.append(card(variant, framework, mount, logList))
  }
}

function chips(variant: Variant) {
  const props = {
    ...variant.content,
    ...variant.options,
    ...(variant.mode === "data" && { items: "data" }),
  }
  return Object.entries(props)
    .map(
      ([key, value]) =>
        `<code class="rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] text-neutral-600">${key}=${JSON.stringify(value)}</code>`
    )
    .join("")
}

const corners: Record<string, string> = {
  "top-left": "top-16 left-4",
  "top-right": "top-16 right-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-right": "bottom-4 right-[25rem]",
}

function card(
  variant: Variant,
  framework: Framework,
  mount: (slot: HTMLElement, variant: Variant, env: Env) => void,
  logList: HTMLOListElement
) {
  const el = document.createElement("article")
  el.className =
    "flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-4"
  el.innerHTML = `
    <div>
      <div class="text-[13px] font-medium">${variant.title}</div>
      ${variant.note ? `<p class="mt-0.5 text-xs text-neutral-500">${variant.note}</p>` : ""}
    </div>
    <div class="flex flex-wrap gap-1">${chips(variant)}</div>
    <div data-stage class="mt-auto flex min-h-12 items-center"></div>
  `
  const stage = el.querySelector<HTMLElement>("[data-stage]")!
  const slot = document.createElement("div")
  slot.className = "contents"

  const env: Env = {
    log(message) {
      const row = document.createElement("li")
      row.innerHTML = `<span class="text-neutral-400">${new Date().toLocaleTimeString([], { hour12: false })}</span> <span class="text-neutral-950">${variant.id}</span> ${message}`
      logList.prepend(row)
    },
  }

  switch (variant.place) {
    case "top-left":
    case "top-right":
    case "bottom-left":
    case "bottom-right": {
      const fixed = document.createElement("div")
      fixed.className = `fixed z-10 ${corners[variant.place]}`
      fixed.append(slot)
      document.body.append(fixed)
      stage.innerHTML = `<span class="text-xs text-neutral-500">The trigger is pinned to the ${variant.place.replace("-", " ")} of the window.</span>`
      break
    }
    case "scroll": {
      const box = document.createElement("div")
      box.className =
        "h-32 w-full overflow-y-auto rounded-md border border-dashed border-neutral-300 p-3"
      box.innerHTML = `<div class="h-12 text-xs text-neutral-400">Scroll ↓</div>`
      const inner = document.createElement("div")
      inner.className = "pb-32"
      inner.append(slot)
      box.append(inner)
      stage.append(box)
      break
    }
    case "clip": {
      const box = document.createElement("div")
      box.className =
        "h-12 w-full overflow-hidden rounded-md border border-dashed border-neutral-300 p-2"
      box.append(slot)
      stage.append(box)
      break
    }
    case "transform": {
      const box = document.createElement("div")
      box.className =
        "w-full origin-center scale-90 rotate-2 rounded-md border border-dashed border-neutral-300 p-2"
      box.append(slot)
      stage.append(box)
      break
    }
    case "rtl": {
      const box = document.createElement("div")
      box.dir = "rtl"
      box.className = "w-full"
      box.append(slot)
      stage.append(box)
      break
    }
    default:
      stage.append(slot)
  }

  if (variant.portal) {
    // A container outside the card, so the popup is clearly not where its trigger is.
    const container = document.createElement("div")
    container.id = `portal-${variant.id}`
    container.dataset.portal = variant.id
    document.body.append(container)
    env.container = container
  }

  if (variant.controller) {
    env.controller = createMenuController()
    const buttons = document.createElement("div")
    buttons.className = "flex gap-2 text-xs"
    for (const [label, run] of [
      ["Open", () => env.controller!.open({ focus: "first" })],
      ["Close", () => env.controller!.close()],
      ["Toggle", () => env.controller!.toggle()],
      ["Is open?", () => env.log(`isOpen: ${env.controller!.isOpen()}`)],
    ] as const) {
      const button = document.createElement("button")
      button.className =
        "rounded border border-neutral-200 px-2 py-1 hover:bg-neutral-50"
      button.textContent = label
      button.addEventListener("click", run)
      buttons.append(button)
    }
    stage.after(buttons)
  }

  mount(slot, variant, env)
  return el
}

export { type Env, kitchenSink }
