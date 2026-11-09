import {
  createDrawerController,
  type DrawerController,
  type SnapPoint,
} from "@ui-sdk/core/drawer"
import "./styles.css"
import type { Variant } from "./variants"
import { variants } from "./variants"

type Env = {
  log: (message: string) => void
  // Every card has one. Snap buttons inside the drawer, the card's controller
  // buttons and an outlet outside the root all go through it.
  controller: DrawerController
  // The drawer's id, which a web outlet outside the root names with `for`.
  id: string
  // Set for portaled variants.
  container?: HTMLElement
}

type Framework = "react" | "vue" | "web"

const frameworks: Record<Framework, string> = {
  react: "React",
  vue: "Vue",
  web: "Web Components",
}

// What every framework logs, worded the same.
function openChangeMessage(
  open: boolean,
  details: { reason: string; returnValue?: string }
) {
  return `openChange ${open} (${details.reason})${details.returnValue ? ` returnValue=${details.returnValue}` : ""}`
}

function snapPointChangeMessage(
  snapPoint: SnapPoint,
  details: { reason: string },
  refused: boolean
) {
  return `snapPointChange ${JSON.stringify(snapPoint)} (${details.reason})${refused ? " canceled" : ""}`
}

// Whether the variant cancels a move to this snap point.
function refuses(variant: Variant, snapPoint: SnapPoint) {
  return (
    variant.refuseSnap !== undefined &&
    String(variant.refuseSnap) === String(snapPoint)
  )
}

// The snap points a variant's buttons move between.
function snapPointsOf(variant: Variant) {
  return variant.options?.snapPoints ?? ["content" as const]
}

// Builds the page in plain DOM and asks the framework to mount one drawer per card.
function kitchenSink(
  root: HTMLElement,
  framework: Framework,
  mount: (slot: HTMLElement, variant: Variant, env: Env) => void
) {
  document.title = `Drawer kitchen sink · ${frameworks[framework]}`
  root.className =
    "min-h-[200vh] bg-neutral-50 pb-80 font-sans text-neutral-950 antialiased"
  root.innerHTML = `
    <header class="sticky top-0 z-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-neutral-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6">
      <h1 class="text-sm font-semibold">Drawer kitchen sink</h1>
      <nav class="flex gap-1 text-[13px]">
        ${Object.entries(frameworks)
          .map(
            ([id, label]) =>
              `<a href="?fixture=drawer-kitchen-sink&framework=${id}" class="rounded-md px-2.5 py-1 ${
                id === framework
                  ? "bg-neutral-950 text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }">${label}</a>`
          )
          .join("")}
      </nav>
      <span class="text-xs text-neutral-500 sm:ms-auto">${variants.length} variants · every event is logged below</span>
    </header>
    <main class="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-8 sm:px-6"></main>
    <aside class="fixed right-4 bottom-4 left-4 z-20 flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg sm:left-auto sm:w-96">
      <div class="flex items-center border-b border-neutral-200 px-3 py-2 text-xs font-medium">
        Events
        <button data-clear class="ms-auto text-neutral-500 hover:text-neutral-950">Clear</button>
      </div>
      <ol aria-live="polite" data-log class="h-24 overflow-y-auto px-3 py-2 font-mono text-[11px] leading-5 text-neutral-600 sm:h-56"></ol>
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
    grid.append(card(variant, mount, logList))
  }
}

function chips(variant: Variant) {
  const props = {
    ...variant.options,
    ...variant.content,
    ...(variant.size && { size: variant.size }),
    ...(variant.body && { body: variant.body }),
    ...(variant.nested && { nested: variant.nested }),
    ...(variant.place && { place: variant.place }),
    ...(variant.controlled && {
      controlled: Object.keys(variant.controlled).join("+"),
    }),
    ...(variant.refuseSnap !== undefined && { refuseSnap: variant.refuseSnap }),
    ...(variant.controller && { controller: variant.controller }),
    ...(variant.action && { action: true }),
    ...(variant.outlet && { outlet: variant.outlet.keyframes }),
  }
  return Object.entries(props)
    .map(
      ([key, value]) =>
        `<code class="rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] break-all text-neutral-600">${key}=${JSON.stringify(value)}</code>`
    )
    .join("")
}

function card(
  variant: Variant,
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
    <div data-stage class="mt-auto flex min-h-12 flex-col items-start gap-3"></div>
  `
  const stage = el.querySelector<HTMLElement>("[data-stage]")!
  const slot = document.createElement("div")
  slot.className = "contents"

  const env: Env = {
    id: `drawer-${variant.id}`,
    controller: createDrawerController(),
    log(message) {
      const row = document.createElement("li")
      row.innerHTML = `<span class="text-neutral-400">${new Date().toLocaleTimeString([], { hour12: false })}</span> <span class="text-neutral-950">${variant.id}</span> ${message}`
      logList.prepend(row)
    },
  }

  switch (variant.place) {
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
      box.className =
        "w-full rounded-md border border-dashed border-neutral-300 p-2"
      box.append(slot)
      stage.append(box)
      break
    }
    default:
      stage.append(slot)
  }

  if (variant.portal) {
    // A container outside the card, so the drawer is clearly not where its trigger is.
    const container = document.createElement("div")
    container.id = `portal-${variant.id}`
    container.dataset.portal = variant.id
    document.body.append(container)
    env.container = container
  }

  if (variant.themeMeta) {
    watchThemeColor(env)
  }

  const button = (label: string, run: () => void) => {
    const el = document.createElement("button")
    el.className =
      "rounded border border-neutral-200 px-2 py-1 hover:bg-neutral-50"
    el.textContent = label
    el.addEventListener("click", run)
    return el
  }

  if (variant.pageButton) {
    // Presses that reach the page behind are logged, so modality shows.
    const press = button("Page button", () => env.log("page button pressed"))
    press.className += " text-xs"
    stage.append(press)
  }

  if (variant.controller) {
    const buttons = document.createElement("div")
    buttons.className = "flex flex-wrap gap-2 text-xs"
    const { controller } = env
    if (variant.controller === "open") {
      buttons.append(
        button("open()", () => controller.open()),
        button("close()", () => controller.close()),
        button("isOpen()", () => env.log(`isOpen: ${controller.isOpen()}`))
      )
    }
    if (variant.controller === "await") {
      buttons.append(
        button("await open()", async () =>
          env.log(`open() resolved: ${JSON.stringify(await controller.open())}`)
        )
      )
    }
    if (variant.controller === "snap") {
      buttons.append(
        ...snapPointsOf(variant).map((point) =>
          button(`setSnapPoint(${JSON.stringify(point)})`, () =>
            controller.setSnapPoint(point)
          )
        ),
        button("getSnapPoint()", () =>
          env.log(`getSnapPoint: ${JSON.stringify(controller.getSnapPoint())}`)
        )
      )
    }
    stage.after(buttons)
  }

  mount(slot, variant, env)
  return el
}

// Gives the page a theme color, which a drawer with `themeColor` dims, and logs every write.
function watchThemeColor(env: Env) {
  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (!meta) {
    meta = document.createElement("meta")
    meta.name = "theme-color"
    meta.content = "#ffffff"
    document.head.append(meta)
  }
  const watched = meta
  new MutationObserver(() => env.log(`theme-color ${watched.content}`)).observe(
    watched,
    {
      attributes: true,
      attributeFilter: ["content"],
    }
  )
}

export {
  type Env,
  kitchenSink,
  openChangeMessage,
  refuses,
  snapPointChangeMessage,
  snapPointsOf,
}
