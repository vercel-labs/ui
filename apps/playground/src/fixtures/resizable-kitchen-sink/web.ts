import type { UiResizableElement } from "@ui-sdk/web"
import { classes as c } from "./classes"
import { describe, isHandleDisabled, renderShell } from "./shell"
import { presets, type GroupSpec, type PanelSpec } from "./variants"

const kebab = (name: string) =>
  name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)

// Options as attributes, in kebab case. A layout is comma-separated.
function attributes(options: Record<string, unknown> = {}) {
  return Object.entries(options)
    .map(([key, value]) => {
      if (value === true) {
        return ` ${kebab(key)}`
      }
      if (value === false || value === undefined) {
        return ""
      }
      return ` ${kebab(key)}="${Array.isArray(value) ? value.join(",") : value}"`
    })
    .join("")
}

function panel({ label, nested, ...sizes }: PanelSpec) {
  return `<ui-resizable-panel class="${c.panel}"${attributes(sizes)}>${nested ? group(nested, true) : label}</ui-resizable-panel>`
}

function group(spec: GroupSpec, nested = false, extra = ""): string {
  const children = spec.panels
    .map((item, index) => {
      if (index === 0) {
        return panel(item)
      }
      const disabled = isHandleDisabled(spec, index - 1) ? " disabled" : ""
      return `<ui-resizable-handle class="${c.handle}" aria-label="Resize ${spec.panels[index - 1].label}"${disabled}></ui-resizable-handle>${panel(item)}`
    })
    .join("")
  return `<ui-resizable class="${nested ? c.nested : c.group}"${attributes(spec.options)}${extra}>${children}</ui-resizable>`
}

const button = (text: string, action: string) =>
  `<button type="button" class="${c.button}" data-action="${action}">${text}</button>`

async function mount(root: HTMLElement) {
  await import("@ui-sdk/web/resizable")
  renderShell(root, "web", (slot, variant, log) => {
    let body = group(
      variant.group,
      false,
      variant.controlled ? ` layout="${presets[0].join(",")}"` : ""
    )
    if (variant.place === "rtl") {
      body = `<div dir="rtl">${body}</div>`
    }
    if (variant.place === "transformed") {
      body = `<div class="${c.transformed}">${body}</div>`
    }
    if (variant.place === "scroll") {
      body = `<div class="${c.scroll}">${body}</div>`
    }
    const buttons = [
      ...(variant.controlled
        ? presets.map((preset, index) =>
            button(`Set ${describe(preset)}`, `preset-${index}`)
          )
        : []),
      ...(variant.controller
        ? [
            button("Collapse", "collapse"),
            button("Expand", "expand"),
            button("160px", "resize"),
          ]
        : []),
      ...(variant.conditional ? [button("Add panel", "toggle")] : []),
    ]
    slot.innerHTML = `${body}<div class="${c.row}">${buttons.join("")}</div>`
    const element = slot.querySelector<UiResizableElement>("ui-resizable")!
    slot.addEventListener(
      "layoutchange",
      (event) => {
        const { value, reason } = (
          event as CustomEvent<{ value: number[]; reason: string }>
        ).detail
        log.change(`${describe(value)} (${reason})`)
        // A controlled group takes the layout back, like a framework passing it down.
        if (variant.controlled && event.target === element) {
          element.setAttribute("layout", value.join(","))
        }
      },
      { capture: true }
    )
    slot.addEventListener(
      "layoutcommit",
      (event) => {
        const { value, reason } = (
          event as CustomEvent<{ value: number[]; reason: string }>
        ).detail
        log.commit(`${describe(value)} (${reason})`)
      },
      { capture: true }
    )
    slot.addEventListener("click", (event) => {
      const action = (event.target as HTMLElement).closest("button")?.dataset
        .action
      if (!action) {
        return
      }
      if (action.startsWith("preset-")) {
        element.setAttribute(
          "layout",
          presets[Number(action.slice(7))].join(",")
        )
      }
      if (action === "collapse") {
        element.api.collapse("sidebar")
      }
      if (action === "expand") {
        element.api.expand("sidebar")
      }
      if (action === "resize") {
        element.api.resize("sidebar", "160px")
      }
      if (action === "toggle") {
        const extra = element.querySelector(":scope > #extra")
        if (extra) {
          extra.previousElementSibling?.remove()
          extra.remove()
        } else {
          element.insertAdjacentHTML(
            "beforeend",
            `<ui-resizable-handle class="${c.handle}" aria-label="Resize Two"></ui-resizable-handle><ui-resizable-panel id="extra" class="${c.panel}">Extra</ui-resizable-panel>`
          )
        }
      }
    })
  })
}

export { mount }
