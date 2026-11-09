import type { UiInputElement } from "@ui-sdk/web"
import { classes as c, renderShell } from "./shell"
import type { Variant } from "./variants"

const kebab = (name: string) =>
  name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)

// Options as attributes on the native element: `disabled`, `required`, `defaultValue` as `value`.
function attributes(
  options: Record<string, unknown> = {},
  skip: string[] = []
) {
  return Object.entries(options)
    .filter(([name]) => !skip.includes(name))
    .map(([name, value]) => {
      const attribute =
        name === "defaultValue"
          ? "value"
          : name === "readOnly"
            ? "readonly"
            : kebab(name)
      return value === true
        ? ` ${attribute}`
        : ` ${attribute}="${String(value)}"`
    })
    .join("")
}

function control(variant: Variant) {
  const options = variant.options ?? {}
  if (variant.kind === "textarea") {
    const text = (options.defaultValue as string | undefined) ?? ""
    const auto = options.autoResize ? " auto-resize" : ""
    return `<ui-textarea${auto}><textarea class="${c.textarea}"${attributes(options, ["defaultValue", "autoResize"])}>${text}</textarea></ui-textarea>`
  }
  const input = `<ui-input><input class="${variant.kind === "group" ? c.groupInput : c.input}"${variant.field ? "" : ' aria-label="Value"'}${attributes(options, ["debug"])} /></ui-input>`
  if (variant.kind !== "group") {
    return input
  }
  return `<ui-input-group class="${c.group}">${variant.prefix ? `<span>${variant.prefix}</span>` : ""}${input}<ui-input-clear><button type="button" class="${c.clear}" aria-label="Clear">×</button></ui-input-clear></ui-input-group>`
}

function body(variant: Variant) {
  if (variant.kind === "set") {
    const legend = variant.legendAsDiv
      ? `<ui-field-legend class="${c.legend}">Address</ui-field-legend>`
      : `<legend class="${c.legend}">Address</legend>`
    const set = `<ui-field-set${variant.options?.disabled ? " disabled" : ""}><fieldset class="${c.set}">${legend}<ui-field-description class="text-xs">Where we send it.</ui-field-description><ui-field name="value" class="${c.field}"><ui-field-label class="${c.label}">Street</ui-field-label><input class="${c.input}" required /></ui-field></fieldset></ui-field-set>`
    return variant.place === "disabled-fieldset"
      ? `<fieldset disabled>${set}</fieldset>`
      : set
  }
  if (!variant.field) {
    return control(variant)
  }
  const invalid = variant.invalid ? " invalid" : ""
  return `<ui-field name="value" class="${c.field}"${invalid}><ui-field-label class="${c.label}">Value</ui-field-label>${control(variant)}<ui-field-error class="${c.error}">${variant.invalid ?? ""}</ui-field-error></ui-field>`
}

function markup(variant: Variant) {
  const controller =
    variant.controller === "input"
      ? `<div class="${c.row}"><button type="button" class="${c.button}" data-set>Set</button><button type="button" class="${c.button}" data-clear>Clear value</button></div>`
      : ""
  const card = `<form class="${c.form}">${body(variant)}${controller}<div class="${c.row}"><button type="submit" class="${c.button}">Submit</button><button type="reset" class="${c.button}">Reset</button></div></form>`
  if (variant.place === "rtl") {
    return `<div dir="rtl">${card}</div>`
  }
  return card
}

async function mount(root: HTMLElement) {
  await import("@ui-sdk/web/field")
  await import("@ui-sdk/web/input")
  renderShell(root, (slot, variant, log) => {
    slot.innerHTML = markup(variant)
    const form = slot.querySelector("form")!
    form.addEventListener("submit", (event) => {
      event.preventDefault()
      log(
        `submitted ${new URLSearchParams(new FormData(form) as unknown as Record<string, string>)}`
      )
    })
    const input = slot.querySelector(
      "ui-input, ui-textarea"
    ) as UiInputElement | null
    input?.addEventListener("valuechange", (event) => {
      if (variant.digitsCanceled && /\d/.test(event.detail.value)) {
        return event.preventDefault()
      }
      log(`${JSON.stringify(event.detail.value)} (${event.detail.reason})`)
    })
    slot
      .querySelector("[data-set]")
      ?.addEventListener("click", () => input?.api.setValue("Grace"))
    slot
      .querySelector("[data-clear]")
      ?.addEventListener("click", () => input?.api.clear())
  })
}

export { mount }
