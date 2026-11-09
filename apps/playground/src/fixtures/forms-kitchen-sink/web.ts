import { classes as c, renderShell } from "./shell"
import type { Variant } from "./variants"

const kebab = (name: string) =>
  name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)

// Options as attributes, in kebab case. Defaults are `default-*`, lists are comma-separated.
function attributes(options: Record<string, unknown> = {}) {
  return Object.entries(options)
    .map(([key, value]) => {
      const name = key === "defaultChecked" ? "default-checked" : kebab(key)
      if (value === true) {
        return ` ${name}`
      }
      if (value === false) {
        return ` ${name}="false"`
      }
      return ` ${name}="${Array.isArray(value) ? value.join(",") : value}"`
    })
    .join("")
}

function indicator(variant: Variant, tag: string, base: string) {
  const kept = variant.indicator === "kept"
  return `<${tag} class="${base} ${variant.indicator === "animated" ? c.animated : ""} ${kept ? c.kept : ""}"${kept ? " keep-mounted" : ""}></${tag}>`
}

function control(variant: Variant) {
  const options = attributes(variant.options)
  const outside = variant.place === "outside" ? ` form="${variant.id}"` : ""
  if (variant.kind === "checkbox") {
    return `<label class="${c.row}"><ui-checkbox class="${c.box}"${options}${outside}>${indicator(variant, "ui-checkbox-indicator", c.indicator)}</ui-checkbox>Accept</label>${
      variant.controller
        ? `<button type="button" class="${c.button}" data-toggle>Toggle from outside</button>`
        : ""
    }`
  }
  if (variant.kind === "switch") {
    return `<label class="${c.row}"><ui-switch class="${c.track}"${options}><ui-switch-thumb class="${c.thumb}"></ui-switch-thumb></ui-switch>Wi-Fi</label>`
  }
  if (variant.kind === "radio") {
    return `<ui-radio-group class="${c.form}" aria-label="Plan"${options}>${variant
      .items!.map(
        ([value, label, disabled]) =>
          `<label class="${c.row}"><ui-radio class="${c.radio}" value="${value}"${disabled ? " disabled" : ""}>${indicator(variant, "ui-radio-indicator", c.dot)}</ui-radio>${label}</label>`
      )
      .join(
        ""
      )}</ui-radio-group>${variant.controller ? `<button type="button" class="${c.button}" data-choose>Choose Enterprise</button>` : ""}`
  }
  if (variant.kind === "checkbox-group") {
    return `<ui-checkbox-group class="${c.form}" aria-label="Toppings"${options}>${
      variant.parent
        ? `<label class="${c.row}"><ui-checkbox class="${c.box}" parent>${indicator(variant, "ui-checkbox-indicator", c.indicator)}</ui-checkbox>All</label>`
        : ""
    }${variant
      .items!.map(
        ([value, label, disabled]) =>
          `<label class="${c.row}"><ui-checkbox class="${c.box}" value="${value}"${disabled ? " disabled" : ""}>${indicator(variant, "ui-checkbox-indicator", c.indicator)}</ui-checkbox>${label}</label>`
      )
      .join("")}</ui-checkbox-group>`
  }
  return `<input class="${c.input}" type="email" name="email" required />`
}

function card(variant: Variant) {
  let body = control(variant)
  if (variant.field) {
    body = `<ui-field class="${c.form}"${attributes({ invalid: variant.field.invalid, disabled: variant.field.disabled })}>
      <ui-field-label>Label</ui-field-label>${body}
      <ui-field-description class="${c.description}">Description</ui-field-description>
      <ui-field-error class="${c.error}"></ui-field-error>
    </ui-field>`
  }
  if (variant.place === "fieldset") {
    body = `<fieldset disabled>${body}</fieldset>`
  }
  if (variant.place === "rtl") {
    body = `<div dir="rtl">${body}</div>`
  }
  const buttons = `<div class="${c.row}"><button class="${c.button}">Submit</button><button type="reset" class="${c.button}">Reset</button></div>`
  return variant.place === "outside"
    ? `<form id="${variant.id}" class="${c.form}">${buttons}</form>${body}`
    : `<form id="${variant.id}" class="${c.form}">${body}${buttons}</form>`
}

async function mount(root: HTMLElement) {
  await import("@ui-sdk/web/checkbox")
  await import("@ui-sdk/web/switch")
  await import("@ui-sdk/web/radio")
  await import("@ui-sdk/web/field")
  renderShell(root, (slot, variant, log) => {
    // Web components are uncontrolled. Controlled variants show the live property instead.
    slot.innerHTML = card(variant)
    for (const type of ["checkedchange", "valuechange"]) {
      slot.addEventListener(type, (event) => {
        const { value, reason } = (
          event as CustomEvent<{ value: unknown; reason: string }>
        ).detail
        log(`${JSON.stringify(value)} (${reason})`)
      })
    }
    slot.querySelector("[data-toggle]")?.addEventListener("click", () => {
      const el = slot.querySelector<HTMLElement & { checked?: unknown }>(
        "ui-checkbox"
      )!
      el.checked = el.checked !== true
    })
    slot.querySelector("[data-choose]")?.addEventListener("click", () => {
      slot.querySelector<HTMLElement & { value?: string }>(
        "ui-radio-group"
      )!.value = "enterprise"
    })
  })
}

export { mount }
