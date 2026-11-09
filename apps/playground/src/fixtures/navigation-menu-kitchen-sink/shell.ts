import {
  createNavigationMenuController,
  type NavigationMenuController,
} from "@ui-sdk/core/navigation-menu"
import "./styles.css"
import type { Variant } from "./variants"
import { items, variants } from "./variants"

type Env = {
  log: (message: string) => void
  // The navigation's id, so anchors can name it with a selector.
  navId: string
  // A selector for the element the viewport or contents position against, when not the trigger.
  anchor?: string
  controller?: NavigationMenuController
  // Set for portaled variants.
  container?: HTMLElement
  // Set for controlled variants: the select outside the menu that shares its value.
  select?: HTMLSelectElement
}

type Framework = "react" | "vue" | "web"

const frameworks: Record<Framework, string> = {
  react: "React",
  vue: "Vue",
  web: "Web Components",
}

// Builds the page in plain DOM and asks the framework to mount one navigation menu per card.
function kitchenSink(
  root: HTMLElement,
  framework: Framework,
  mount: (slot: HTMLElement, variant: Variant, env: Env) => void
) {
  document.title = `Navigation menu kitchen sink · ${frameworks[framework]}`
  root.className =
    "min-h-screen bg-neutral-50 pb-80 font-sans text-neutral-950 antialiased"
  root.innerHTML = `
    <header class="sticky top-0 z-10 flex flex-wrap items-center gap-4 border-b border-neutral-200 bg-white/90 px-6 py-3 backdrop-blur">
      <h1 class="text-sm font-semibold">Navigation menu kitchen sink</h1>
      <nav class="flex gap-1 text-[13px]" aria-label="Frameworks">
        ${Object.entries(frameworks)
          .map(
            ([id, label]) =>
              `<a href="?fixture=navigation-menu-kitchen-sink&framework=${id}" class="rounded-md px-2.5 py-1 ${
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
  const pinned = new Map<string, number>()
  for (const variant of variants) {
    let grid = sections.get(variant.section)
    if (!grid) {
      const section = document.createElement("section")
      section.innerHTML = `<h2 class="mb-3 text-xs font-semibold tracking-wide text-neutral-500 uppercase">${variant.section}</h2>`
      grid = document.createElement("div")
      grid.className =
        "grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-3"
      section.append(grid)
      main.append(section)
      sections.set(variant.section, grid)
    }
    grid.append(card(variant, mount, logList, pinned))
  }
}

function chips(variant: Variant) {
  const props = {
    ...variant.options,
    ...(variant.viewport === false ? { viewport: false } : variant.viewport),
    ...variant.content,
    ...(variant.body && { body: variant.body }),
    ...(variant.anchorNav && { anchor: "nav" }),
    ...(variant.disabled && { disabled: variant.disabled }),
    ...(variant.linkCloseOnSelect && {
      "link closeOnSelect": !(variant.options?.closeOnSelect ?? true),
    }),
    ...(variant.animation && { animation: variant.animation }),
  }
  return Object.entries(props)
    .map(
      ([key, value]) =>
        `<code class="rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] text-neutral-600">${key}=${JSON.stringify(value)}</code>`
    )
    .join("")
}

// Pinned navigations stack down from the top corners and up from the bottom ones.
const corners: Record<
  string,
  { vertical: "top" | "bottom"; horizontal: "left" | "right"; start: number }
> = {
  "top-left": { vertical: "top", horizontal: "left", start: 64 },
  "top-right": { vertical: "top", horizontal: "right", start: 64 },
  "bottom-left": { vertical: "bottom", horizontal: "left", start: 16 },
  // Clear of the event log.
  "bottom-right": { vertical: "bottom", horizontal: "right", start: 16 },
}

function card(
  variant: Variant,
  mount: (slot: HTMLElement, variant: Variant, env: Env) => void,
  logList: HTMLOListElement,
  pinned: Map<string, number>
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
  // Tests find a navigation's variant through the slot around it.
  const slot = document.createElement("div")
  slot.className = "contents"
  slot.dataset.variant = variant.id

  const env: Env = {
    navId: `nav-${variant.id}`,
    log(message) {
      const row = document.createElement("li")
      row.innerHTML = `<span class="text-neutral-400">${new Date().toLocaleTimeString([], { hour12: false })}</span> <span class="text-neutral-950">${variant.id}</span> ${message}`
      logList.prepend(row)
    },
  }
  if (variant.anchorNav) {
    env.anchor = `#${env.navId}`
  }

  switch (variant.place) {
    case "top-left":
    case "top-right":
    case "bottom-left":
    case "bottom-right": {
      const corner = corners[variant.place]
      const index = pinned.get(variant.place) ?? 0
      pinned.set(variant.place, index + 1)
      const fixed = document.createElement("div")
      fixed.className =
        "fixed z-10 rounded-lg border border-neutral-200 bg-white p-1 shadow-sm"
      fixed.style[corner.vertical] = `${corner.start + index * 48}px`
      fixed.style[corner.horizontal] =
        variant.place === "bottom-right" ? "25rem" : "16px"
      fixed.append(slot)
      document.body.append(fixed)
      stage.innerHTML = `<span class="text-xs text-neutral-500">The navigation is pinned to the ${variant.place.replace("-", " ")} of the window.</span>`
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
        "h-12 w-full overflow-hidden rounded-md border border-dashed border-neutral-300 p-1.5"
      box.append(slot)
      stage.append(box)
      break
    }
    case "transform": {
      const box = document.createElement("div")
      box.className =
        "w-full origin-center scale-90 rotate-2 rounded-md border border-dashed border-neutral-300 p-1.5"
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

  if (variant.controlled) {
    const label = document.createElement("label")
    label.className = "flex items-center gap-2 text-xs text-neutral-600"
    const select = document.createElement("select")
    select.className =
      "h-7 rounded border border-neutral-200 bg-white px-1.5 text-xs"
    select.setAttribute("aria-label", "Open item")
    select.innerHTML = `<option value="">None</option>${items
      .map((item) => `<option value="${item.value}">${item.label}</option>`)
      .join("")}`
    label.append("Open item", select)
    stage.after(label)
    env.select = select
  }

  if (variant.controller) {
    const controller = createNavigationMenuController()
    env.controller = controller
    const buttons = document.createElement("div")
    buttons.className = "flex flex-wrap gap-2 text-xs"
    for (const [label, run] of [
      ["Open Products", () => controller.setValue("products")],
      ["Open Company", () => controller.setValue("company")],
      ["Close", () => controller.close()],
      ["Focus", () => controller.focus()],
      ["Is open?", () => env.log(`isOpen: ${controller.isOpen()}`)],
      ["Value?", () => env.log(`value: ${controller.getValue()}`)],
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
