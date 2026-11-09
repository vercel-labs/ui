import "@ui-sdk/web/toggle"
import "@ui-sdk/web/button"
import "@ui-sdk/web/separator"
import type {
  UiActionDetail,
  UiToggleElement,
  UiToggleGroupElement,
} from "@ui-sdk/web"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import { items, pendingAction, type Variant } from "./variants"

const kebab = (name: string) =>
  name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)

// Attributes for every option that is set: booleans by presence, lists comma-separated.
function attributes(options: Record<string, unknown> = {}) {
  return Object.entries(options)
    .map(([name, value]) => {
      if (value === true) {
        return ` ${kebab(name)}`
      }
      if (value === false) {
        return ` ${kebab(name)}="false"`
      }
      return ` ${kebab(name)}="${value}"`
    })
    .join("")
}

// The element a toggle wraps.
const toggleElement = (variant: Variant, label: string) =>
  variant.render === "span"
    ? `<span class="${classes.toggle}">${label}</span>`
    : `<button class="${classes.toggle}">${label}</button>`

function markup(variant: Variant) {
  switch (variant.section) {
    case "Toggle":
      return `<ui-toggle${attributes(variant.options)}>${toggleElement(variant, "Bookmark")}</ui-toggle>`
    case "Toggle Group":
      return `<ui-toggle-group class="${classes.group}" aria-label="${variant.title}"${attributes(variant.options)}>${items[
        variant.items ?? "alignment"
      ]
        .map(
          (item) =>
            `<ui-toggle value="${item.value}"${"disabled" in item && item.disabled ? " disabled" : ""}>${toggleElement(variant, item.label)}</ui-toggle>`
        )
        .join("")}</ui-toggle-group>`
    case "Button": {
      const label =
        variant.form === "reset"
          ? "Reset"
          : variant.render === "link"
            ? "Docs"
            : "Save"
      const inner =
        variant.render === "link"
          ? `<a class="${classes.button}" href="#kitchen-sink-link">${label}</a>`
          : variant.render === "span"
            ? `<span class="${classes.button}">${label}</span>`
            : `<button class="${classes.button}"${variant.form ? ` type="${variant.form}"` : ""}>${label}</button>`
      const button = `<ui-button${attributes(variant.options)}>${inner}</ui-button>`
      if (!variant.form) {
        return button
      }
      return `<form class="flex items-center gap-2"><input class="h-8 w-28 rounded-md border border-neutral-200 px-2 text-[13px]" aria-label="Name" value="Ada">${button}</form>`
    }
    case "Separator": {
      const separator =
        variant.render === "hr"
          ? `<ui-separator as-child${attributes(variant.options)}><hr class="${classes.separator}"></ui-separator>`
          : `<ui-separator class="${classes.separator}"${attributes(variant.options)}></ui-separator>`
      const layout =
        variant.options?.orientation === "vertical"
          ? classes.row
          : classes.column
      return `<div class="${layout}"><span>Blog</span>${separator}<span>Docs</span></div>`
    }
  }
}

function listen(slot: HTMLElement, variant: Variant, env: Env) {
  slot.addEventListener(
    "pressedchange",
    (event) => {
      if (variant.section !== "Toggle") {
        return
      }
      const { value, reason, source } = (event as CustomEvent).detail
      if (variant.cancel) {
        return event.preventDefault()
      }
      env.log(`pressedChange ${value} (${reason}, ${source})`)
    },
    { capture: true }
  )
  slot.addEventListener(
    "valuechange",
    (event) => {
      const { value, reason, source } = (event as CustomEvent).detail
      if (variant.cancel) {
        return event.preventDefault()
      }
      env.log(`valueChange [${value}] (${reason}, ${source})`)
    },
    { capture: true }
  )
  slot.addEventListener(
    "action",
    (event) => {
      if (!variant.action) {
        return
      }
      env.log("click")
      if (variant.action !== "resolve" && variant.action !== "reject") {
        return
      }
      ;(event as CustomEvent<UiActionDetail>).detail.waitUntil(
        pendingAction(variant).then(
          () => env.log("done"),
          (error: Error) => {
            env.log(`failed: ${error.message}`)
            throw error
          }
        )
      )
    },
    { capture: true }
  )
  slot.addEventListener("submit", (event) => {
    event.preventDefault()
    env.log("submit")
  })
  slot.addEventListener("reset", () => env.log("reset"))
}

function controls(slot: HTMLElement, variant: Variant, env: Env) {
  if (!variant.controller) {
    return
  }
  const toggle = slot.querySelector<UiToggleElement>("ui-toggle")!
  if (variant.section === "Toggle") {
    return env.controls([
      ["toggle()", () => toggle.api.toggle()],
      ["setPressed(true)", () => toggle.api.setPressed(true)],
      ["isPressed()", () => toggle.api.isPressed()],
      ["focus()", () => toggle.api.focus()],
    ])
  }
  const group = slot.querySelector<UiToggleGroupElement>("ui-toggle-group")!
  env.controls([
    ["setValue([bold, italic])", () => group.api.setValue(["bold", "italic"])],
    ["toggle(underline)", () => group.api.toggle("underline")],
    ["getValue()", () => group.api.getValue()],
    ["focus()", () => group.api.focus()],
  ])
}

function mount(root: HTMLElement) {
  kitchenSink(root, "web", (slot, variant, env) => {
    slot.innerHTML = markup(variant)
    listen(slot, variant, env)
    controls(slot, variant, env)
  })
}

export { mount }
