import {
  createSelectController,
  type SelectController,
} from "@ui-sdk/core/select"
import * as classes from "./classes"
import "./styles.css"
import type { Variant } from "./variants"
import { sampleValue, variants } from "./variants"

type Env = {
  log: (message: string) => void
  controller?: SelectController<any, any>
  // Set for portaled variants.
  container?: HTMLElement
  // Set for variants that position against something other than the trigger.
  anchor?: HTMLElement
}

type Framework = "react" | "vue" | "web"

const frameworks: Record<Framework, string> = {
  react: "React",
  vue: "Vue",
  web: "Web Components",
}

// A short, readable form of a value for the log: strings, lists and country objects.
function show(value: unknown) {
  const one = (item: unknown) =>
    item && typeof item === "object" && "name" in item
      ? String(item.name)
      : (JSON.stringify(item) ?? "undefined")
  return Array.isArray(value) ? `[${value.map(one).join(", ")}]` : one(value)
}

// Builds the page in plain DOM and asks the framework to mount one select per card.
function kitchenSink(
  root: HTMLElement,
  framework: Framework,
  mount: (slot: HTMLElement, variant: Variant, env: Env) => void
) {
  document.title = `Select kitchen sink · ${frameworks[framework]}`
  root.className =
    "min-h-screen bg-neutral-50 pb-80 font-sans text-neutral-950 antialiased"
  root.innerHTML = `
    <header class="sticky top-0 z-10 flex flex-wrap items-center gap-4 border-b border-neutral-200 bg-white/90 px-6 py-3 backdrop-blur">
      <h1 class="text-sm font-semibold">Select kitchen sink</h1>
      <nav class="flex gap-1 text-[13px]">
        ${Object.entries(frameworks)
          .map(
            ([id, label]) =>
              `<a href="?fixture=select-kitchen-sink&framework=${id}" class="rounded-md px-2.5 py-1 ${
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
        "grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3"
      section.append(grid)
      main.append(section)
      sections.set(variant.section, grid)
    }
    grid.append(card(variant, framework, mount, logList))
  }
}

function chips(variant: Variant) {
  const props = {
    ...(variant.mode === "data" && { items: variant.list ?? "fruits" }),
    ...variant.options,
    ...variant.content,
    ...(variant.triggerDisabled && { "SelectTrigger.disabled": true }),
    ...(variant.clear && { SelectClear: variant.clear }),
    ...(variant.indicatorKeepMounted && {
      "SelectItemIndicator.keepMounted": true,
    }),
    ...(variant.arrow && { SelectArrow: true }),
    ...(variant.portal && { container: "#portal" }),
    ...(variant.controlled && { controlled: variant.controlled }),
  }
  return Object.entries(props)
    .map(
      ([key, value]) =>
        `<code class="rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] text-neutral-600">${key}=${JSON.stringify(value)}</code>`
    )
    .join("")
}

// Where pinned triggers sit. Several in one corner stack away from the edge.
const corners: Record<
  string,
  { x: string; y: "top" | "bottom"; start: number }
> = {
  "top-left": { x: "left: 16px", y: "top", start: 64 },
  "top-right": { x: "right: 16px", y: "top", start: 64 },
  "bottom-left": { x: "left: 16px", y: "bottom", start: 16 },
  "bottom-right": { x: "right: 25rem", y: "bottom", start: 16 },
}
const pinned = new Map<string, number>()

function button(label: string, run: () => void) {
  const el = document.createElement("button")
  el.type = "button"
  el.className = classes.button
  el.textContent = label
  el.addEventListener("click", run)
  return el
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
  el.dataset.variant = variant.id
  el.innerHTML = `
    <div>
      <div class="text-[13px] font-medium">${variant.title}</div>
      ${variant.note ? `<p class="mt-0.5 text-xs text-neutral-500">${variant.note}</p>` : ""}
    </div>
    <div class="flex flex-wrap gap-1">${chips(variant)}</div>
    <div data-stage class="mt-auto flex min-h-12 flex-wrap items-center gap-2"></div>
  `
  const stage = el.querySelector<HTMLElement>("[data-stage]")!
  const slot = document.createElement("div")
  slot.className = "contents"

  const env: Env = {
    log(message) {
      const row = document.createElement("li")
      row.innerHTML = `<span class="text-neutral-400">${new Date().toLocaleTimeString([], { hour12: false })}</span> <span class="text-neutral-950">${variant.id}</span> `
      row.append(message)
      logList.prepend(row)
    },
  }

  // A form around the select, with Submit and Reset. Submitting logs what the form holds.
  let target: HTMLElement = slot
  if (variant.form) {
    const form = document.createElement("form")
    form.className = "flex w-full flex-col gap-2"
    const buttons = document.createElement("div")
    buttons.className = "flex gap-2"
    const submit = button("Submit", () => {})
    submit.type = "submit"
    const reset = button("Reset", () => {})
    reset.type = "reset"
    buttons.append(submit, reset)
    form.append(slot, buttons)
    form.addEventListener("submit", (event) => {
      event.preventDefault()
      const entries = [...new FormData(form)].map(
        ([name, value]) => `${name}=${value}`
      )
      env.log(`submit ${entries.join("&") || "(nothing)"}`)
    })
    form.addEventListener("reset", () => env.log("reset"))
    form.addEventListener("invalid", () => env.log("invalid"), true)
    target = form
  }

  switch (variant.place) {
    case "top-left":
    case "top-right":
    case "bottom-left":
    case "bottom-right": {
      const fixed = document.createElement("div")
      const corner = corners[variant.place]
      const stacked = pinned.get(variant.place) ?? 0
      pinned.set(variant.place, stacked + 1)
      fixed.className = "fixed z-10 flex items-center gap-2"
      fixed.style.cssText = `${corner.x}; ${corner.y}: ${corner.start + stacked * 44}px`
      fixed.dataset.variant = variant.id
      fixed.append(target)
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
      inner.append(target)
      box.append(inner)
      stage.append(box)
      break
    }
    case "clip": {
      const box = document.createElement("div")
      box.className =
        "h-12 w-full overflow-hidden rounded-md border border-dashed border-neutral-300 p-2"
      box.append(target)
      stage.append(box)
      break
    }
    case "transform": {
      const box = document.createElement("div")
      box.className =
        "w-full origin-center scale-90 rotate-2 rounded-md border border-dashed border-neutral-300 p-2"
      box.append(target)
      stage.append(box)
      break
    }
    case "rtl": {
      const box = document.createElement("div")
      box.dir = "rtl"
      box.className = "flex w-full items-center gap-2"
      box.append(target)
      stage.append(box)
      break
    }
    default:
      stage.append(target)
  }

  if (variant.portal) {
    // A container outside the card, so the popup is clearly not where its trigger is.
    const container = document.createElement("div")
    container.id = `portal-${variant.id}`
    container.dataset.portal = variant.id
    document.body.append(container)
    env.container = container
  }

  if (variant.anchor) {
    const anchor = document.createElement("div")
    anchor.className = classes.anchor
    anchor.id = `anchor-${variant.id}`
    anchor.textContent = "Anchor"
    stage.append(anchor)
    env.anchor = anchor
  }

  if (variant.controller) {
    const controller = createSelectController<any, boolean>()
    env.controller = controller
    const buttons = document.createElement("div")
    buttons.className = "flex flex-wrap gap-1.5"
    buttons.append(
      button("Open", () =>
        controller
          .open()
          .then((result) => env.log(`open() resolved (${result.reason})`))
      ),
      button("Close", () => controller.close()),
      button("Toggle", () => controller.toggle()),
      button("Set", () => controller.setValue(sampleValue(variant))),
      button("Clear", () => controller.clear()),
      button("Get", () =>
        env.log(
          `getValue ${show(controller.getValue())} · isOpen ${controller.isOpen()}`
        )
      ),
      button("Focus", () => controller.focus())
    )
    stage.after(buttons)
  }

  mount(slot, variant, env)
  return el
}

export { type Env, kitchenSink, show }
