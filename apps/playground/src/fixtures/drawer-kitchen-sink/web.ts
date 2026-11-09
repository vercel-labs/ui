import "@ui-sdk/web/drawer"
import type { UiDrawerElement } from "@ui-sdk/web/drawer"
import * as classes from "./classes"
import {
  kitchenSink,
  openChangeMessage,
  refuses,
  snapPointChangeMessage,
  snapPointsOf,
} from "./shell"
import { flakyAction, type Variant } from "./variants"

const kebab = (name: string) =>
  name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)

// Options as attributes, except the ones only a property can hold.
function applyOptions(el: UiDrawerElement, options: Variant["options"] = {}) {
  for (const [option, value] of Object.entries(options)) {
    if (option === "physics") {
      el.physics = options.physics
    } else {
      el.setAttribute(
        kebab(option),
        Array.isArray(value) ? value.join(",") : String(value)
      )
    }
  }
}

function body(variant: Variant) {
  if (variant.body === "scroll") {
    return `<ul class="${classes.scroll}" aria-label="Activity" tabindex="0">${Array.from(
      { length: 40 },
      (_, index) => `<li class="${classes.scrollItem}">Day ${index + 1}</li>`
    ).join("")}</ul>`
  }
  if (variant.body === "tall") {
    return Array.from(
      { length: 60 },
      (_, index) => `<p>Paragraph ${index + 1}</p>`
    ).join("")
  }
  if (variant.body === "form") {
    return `<div class="flex flex-col gap-3">
      <label class="${classes.field}">Name<input class="${classes.input}" value="Ada" /></label>
      <label class="${classes.field}">Email<input class="${classes.input}" type="email" /></label>
      <label class="${classes.field}">Notes<textarea class="${classes.textarea}"></textarea></label>
    </div>`
  }
  if (variant.body === "snap-buttons") {
    return `<div class="${classes.snapButtons}">${snapPointsOf(variant)
      .map(
        (point) =>
          `<button class="${classes.button}" data-snap="${point}">${point}</button>`
      )
      .join("")}</div>`
  }
  return ""
}

// Drawers opened from inside each other, built from the innermost out.
function nestedDrawers(variant: Variant) {
  const side = variant.options?.side ? `side="${variant.options.side}"` : ""
  let inner = ""
  for (let level = (variant.nested ?? 0) + 1; level >= 2; level--) {
    inner = `
      <ui-drawer ${side} data-level="${level}">
        <ui-drawer-trigger><button class="${classes.trigger}">Open level ${level}</button></ui-drawer-trigger>
        <ui-drawer-backdrop class="${classes.backdrop}"></ui-drawer-backdrop>
        <ui-drawer-content class="${classes.content()}">
          <ui-drawer-handle><button class="${classes.handle}" aria-label="Resize"></button></ui-drawer-handle>
          <div class="${classes.header}">
            <ui-drawer-title class="${classes.title}">Level ${level}</ui-drawer-title>
            <ui-drawer-description class="${classes.description}">The one beneath scales back.</ui-drawer-description>
          </div>
          <div class="${classes.actions}">
            ${inner}
            <ui-drawer-close><button class="${classes.button}">Close</button></ui-drawer-close>
          </div>
        </ui-drawer-content>
      </ui-drawer>`
  }
  return inner
}

const outlet = (variant: Variant, target: string) =>
  `<ui-drawer-outlet ${target} class="${classes.outlet}">Page behind</ui-drawer-outlet>`

function mount(root: HTMLElement) {
  kitchenSink(root, "web", (slot, variant, env) => {
    const short = variant.body === "short"
    const drawer = document.createElement("ui-drawer")
    drawer.id = env.id
    applyOptions(drawer, variant.options)
    drawer.controller = env.controller
    if (env.container) {
      drawer.setAttribute("container", `#${env.container.id}`)
    }
    const contentAttributes = Object.entries(variant.content ?? {})
      .map(([name, value]) => `${kebab(name)}="${value}"`)
      .join(" ")
    drawer.innerHTML = `
      <ui-drawer-trigger><button class="${classes.trigger}">${variant.trigger ?? "Open"}</button></ui-drawer-trigger>
      ${variant.outlet?.inside ? outlet(variant, "") : ""}
      <ui-drawer-backdrop class="${classes.backdrop}"></ui-drawer-backdrop>
      <ui-drawer-content class="${classes.content(variant.size)}" ${contentAttributes}>
        ${short ? "" : `<ui-drawer-handle><button class="${classes.handle}" aria-label="Resize"></button></ui-drawer-handle>`}
        <div class="${classes.header}">
          <ui-drawer-title class="${classes.title}">${variant.title}</ui-drawer-title>
          ${short ? "" : `<ui-drawer-description class="${classes.description}">${variant.note ?? "A drawer."}</ui-drawer-description>`}
        </div>
        ${body(variant)}
        <div class="${classes.actions}">
          ${nestedDrawers(variant)}
          ${variant.action ? `<ui-drawer-close value="saved" action><button class="${classes.primary}">Save</button></ui-drawer-close>` : ""}
          <ui-drawer-close><button class="${classes.button}">Close</button></ui-drawer-close>
        </div>
      </ui-drawer-content>
    `
    const row = Object.assign(document.createElement("div"), {
      className: "flex w-full flex-wrap items-center gap-3",
    })
    row.append(drawer)
    slot.append(row)
    if (variant.outlet && !variant.outlet.inside) {
      slot.insertAdjacentHTML("beforeend", outlet(variant, `for="${env.id}"`))
    }
    for (const el of slot.querySelectorAll<
      HTMLElement & { keyframes?: unknown }
    >("ui-drawer-outlet")) {
      el.keyframes = variant.outlet?.keyframes
    }

    // Web components have no controlled props. The checkbox and the snap
    // buttons set the element's live properties instead.
    const snapLabel = document.createElement("span")
    snapLabel.className = "text-xs text-neutral-600"
    const showSnap = () =>
      (snapLabel.textContent = `snapPoint=${JSON.stringify(drawer.snapPoint ?? null)}`)
    for (const button of drawer.querySelectorAll<HTMLElement>("[data-snap]")) {
      const point = snapPointsOf(variant).find(
        (entry) => String(entry) === button.dataset.snap
      )!
      button.addEventListener("click", () => {
        if (variant.controlled?.snapPoint) {
          drawer.snapPoint = point
        } else {
          env.controller.setSnapPoint(point)
        }
      })
    }
    const checkbox = Object.assign(document.createElement("input"), {
      type: "checkbox",
    })
    if (variant.controlled?.open) {
      const label = Object.assign(document.createElement("label"), {
        className: "flex items-center gap-1.5 text-xs text-neutral-600",
      })
      label.append(checkbox, "open")
      row.append(label)
      checkbox.addEventListener(
        "change",
        () => (drawer.open = checkbox.checked)
      )
    }
    if (variant.controlled?.snapPoint) {
      row.append(snapLabel)
      showSnap()
    }

    // An action event: waitUntil() keeps the drawer open and the button pending.
    const action = drawer.querySelector("ui-drawer-close[action]")
    action?.addEventListener("action", (event) => {
      const button = action.querySelector("button")!
      button.textContent = "Saving…"
      const run = flakyAction()
      ;(
        event as CustomEvent<{ waitUntil: (promise: Promise<unknown>) => void }>
      ).detail.waitUntil(run)
      run.catch(() => (button.textContent = "Retry"))
    })

    // Callbacks are DOM events on the element. Nested drawers bubble theirs too.
    drawer.addEventListener("openchange", (event) => {
      const { value, reason, returnValue } = event.detail
      const target = event.target as HTMLElement
      if (target !== drawer) {
        return env.log(
          `level ${target.dataset.level} ${openChangeMessage(value, { reason })}`
        )
      }
      env.log(openChangeMessage(value, { reason, returnValue }))
      checkbox.checked = value
    })
    drawer.addEventListener("openchangecomplete", (event) => {
      if (event.target === drawer) {
        env.log(`openChangeComplete ${event.detail.value}`)
      }
    })
    drawer.addEventListener("snappointchange", (event) => {
      if (event.target !== drawer) {
        return
      }
      const { value: point, reason } = event.detail
      const refused = refuses(variant, point)
      // Canceling the event cancels the change.
      if (refused) {
        event.preventDefault()
      }
      env.log(snapPointChangeMessage(point, { reason }, refused))
      queueMicrotask(showSnap)
    })
    drawer.addEventListener("dismissattempt", (event) => {
      if (event.target === drawer) {
        env.log(`dismissAttempt (${event.detail.reason})`)
      }
    })
  })
}

export { mount }
