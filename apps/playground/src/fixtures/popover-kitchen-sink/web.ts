import "@ui-sdk/web/popover"
import * as classes from "./classes"
import { kitchenSink } from "./shell"
import type { Variant } from "./variants"

const kebab = (name: string) =>
  name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)

function body(variant: Variant) {
  if (variant.body === "text") {
    return ""
  }
  if (variant.body === "long") {
    return Array.from(
      { length: 30 },
      (_, index) => `<p>Line ${index + 1}</p>`
    ).join("")
  }
  if (variant.body === "nested") {
    return `
      <ui-popover>
        <ui-popover-trigger><button class="${classes.trigger}">More</button></ui-popover-trigger>
        <ui-popover-content class="${classes.content()}" side-offset="8">
          <ui-popover-arrow class="${classes.arrow}"></ui-popover-arrow>
          <ui-popover-title class="${classes.title}">More options</ui-popover-title>
          <ui-popover-close><button class="${classes.button}">Done</button></ui-popover-close>
        </ui-popover-content>
      </ui-popover>`
  }
  return `<label class="mb-3 flex flex-col gap-1">Name<input class="${classes.input}" value="Ada" /></label>`
}

function mount(root: HTMLElement) {
  kitchenSink(root, "web", (slot, variant, env) => {
    const popover = document.createElement("ui-popover") as HTMLElement & {
      controller?: unknown
      api?: { open: () => void; close: () => void }
    }
    for (const [option, value] of Object.entries(variant.options ?? {})) {
      popover.setAttribute(kebab(option), String(value))
    }
    if (env.container) {
      popover.setAttribute("container", `#${env.container.id}`)
    }
    if (env.anchor) {
      env.anchor.id = `anchor-${variant.id}`
    }
    const contentAttributes = Object.entries({
      "side-offset": 8,
      ...Object.fromEntries(
        Object.entries(variant.content ?? {}).map(([key, value]) => [
          kebab(key),
          value,
        ])
      ),
      ...(env.anchor && { anchor: `#${env.anchor.id}` }),
    })
      .map(([name, value]) => `${name}="${value}"`)
      .join(" ")
    popover.innerHTML = `
      <ui-popover-trigger><button class="${classes.trigger}">${variant.trigger ?? "Open"}</button></ui-popover-trigger>
      <ui-popover-content class="${classes.content(variant.animation)}" ${contentAttributes}>
        ${variant.arrow !== false ? `<ui-popover-arrow class="${classes.arrow}"></ui-popover-arrow>` : ""}
        ${variant.titled !== false ? `<ui-popover-title class="${classes.title}">${variant.title}</ui-popover-title>` : ""}
        <ui-popover-description class="${classes.description}">${variant.note ?? "A popover."}</ui-popover-description>
        ${body(variant)}
        <div class="flex gap-2">
          <button class="${classes.button}" data-save>Save</button>
          <ui-popover-close><button class="${classes.button}">Close</button></ui-popover-close>
        </div>
      </ui-popover-content>
    `
    const wrapper = Object.assign(document.createElement("div"), {
      className: "flex items-center gap-3",
    })
    wrapper.append(popover)
    slot.append(wrapper)
    popover
      .querySelector("[data-save]")!
      .addEventListener("click", () => env.log("save"))

    // Callbacks are DOM events on the element. Nested popovers bubble theirs too.
    popover.addEventListener("openchange", (event) => {
      if (event.target !== popover) {
        return
      }
      const { value, reason } = (
        event as CustomEvent<{ value: boolean; reason: string }>
      ).detail
      env.log(`openChange ${value} (${reason})`)
      if (variant.controlled) {
        checkbox.checked = value
      }
    })
    popover.controller = env.controller

    // Web components have no controlled prop. The checkbox drives the element's api instead.
    const checkbox = Object.assign(document.createElement("input"), {
      type: "checkbox",
    })
    if (variant.controlled) {
      const label = Object.assign(document.createElement("label"), {
        className: "flex items-center gap-1.5 text-xs text-neutral-600",
      })
      label.append(checkbox, "open")
      wrapper.append(label)
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          popover.api?.open()
        } else {
          popover.api?.close()
        }
      })
    }
  })
}

export { mount }
