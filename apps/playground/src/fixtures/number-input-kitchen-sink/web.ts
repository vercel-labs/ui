import {
  createNumberInputController,
  type NumberInputController,
} from "@ui-sdk/core/number-input"
import { classes as c } from "./classes"
import { renderShell } from "./shell"
import { describe, formats, type Variant } from "./variants"

type NumberInputElement = HTMLElement & {
  value: number | null
  format?: Intl.NumberFormatOptions
  controller?: NumberInputController
}

const kebab = (name: string) =>
  name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)

// Options as attributes, in kebab case. An empty attribute is an empty field.
function attributes(options: Record<string, unknown> = {}) {
  return Object.entries(options)
    .map(([key, value]) =>
      value === true ? ` ${kebab(key)}` : ` ${kebab(key)}="${value ?? ""}"`
    )
    .join("")
}

function scrubArea(scrub: Variant["scrub"], owner = "") {
  if (!scrub) {
    return ""
  }
  const arrow = scrub.orientation === "vertical" ? "↕" : "↔"
  const { outside, ...props } = scrub
  return `<ui-number-input-scrub-area class="${c.scrub}"${attributes(props)}${outside ? ` for="${owner}"` : ""}>${arrow} Drag<ui-number-input-scrub-area-cursor class="${c.cursor}">${arrow}</ui-number-input-scrub-area-cursor></ui-number-input-scrub-area>`
}

function control(variant: Variant) {
  const outside = variant.place === "outside" ? ` form="${variant.id}"` : ""
  const label = variant.place === "field" ? "" : ` aria-label="Amount"`
  const button = (label: string, data: string) =>
    `<button type="button" class="${c.button}" ${data}>${label}</button>`
  const presets = variant.presets
    ? `<div class="${c.row}">${variant.presets
        .map((preset, index) =>
          button(`Set ${describe(preset)}`, `data-preset="${index}"`)
        )
        .join("")}${
        variant.controller
          ? button("Decrement", "data-decrement") +
            button("Increment large", "data-increment") +
            button("Focus", "data-focus")
          : ""
      }</div>`
    : ""
  const id = `${variant.id}-input`
  return `${variant.scrub?.outside ? scrubArea(variant.scrub, id) : ""}<ui-number-input id="${id}" class="${c.root}"${attributes(variant.options)}${outside}>
      ${variant.scrub?.outside ? "" : scrubArea(variant.scrub)}
      <ui-number-input-group class="${c.group}">
        <ui-number-input-decrement><button class="${c.step}" aria-label="Decrease">−</button></ui-number-input-decrement>
        <ui-number-input-control><input class="${c.input}"${label} /></ui-number-input-control>
        <ui-number-input-increment><button class="${c.step}" aria-label="Increase">+</button></ui-number-input-increment>
      </ui-number-input-group>
    </ui-number-input>${variant.controlled ? `<span class="${c.description}" data-live></span>` : ""}${presets}`
}

function card(variant: Variant) {
  let body = control(variant)
  if (variant.place === "field") {
    body = `<ui-field class="${c.form}" name="quantity">
      <ui-field-label class="${c.label}">Quantity</ui-field-label>${body}
      <ui-field-description class="${c.description}">How many to order.</ui-field-description>
      <ui-field-error class="${c.error}"></ui-field-error>
    </ui-field>`
  }
  if (variant.place === "fieldset") {
    body = `<fieldset disabled>${body}</fieldset>`
  }
  if (variant.place === "rtl") {
    body = `<div dir="rtl">${body}</div>`
  }
  if (variant.place === "transformed") {
    body = `<div class="${c.transformed}">${body}</div>`
  }
  const buttons = `<div class="${c.row}"><button class="${c.button}">Save</button><button type="reset" class="${c.button}">Reset</button></div>`
  return variant.place === "outside"
    ? `<form id="${variant.id}" class="${c.form}">${buttons}</form>${body}`
    : `<form id="${variant.id}" class="${c.form}">${body}${buttons}</form>`
}

async function mount(root: HTMLElement) {
  renderShell(root, "web", (slot, variant, log) => {
    slot.innerHTML = card(variant)
    const field = slot.querySelector<NumberInputElement>("ui-number-input")!
    // Rich options are properties, set here before the elements upgrade.
    if (variant.format) {
      field.format = formats[variant.format]
    }
    const controller = variant.controller
      ? createNumberInputController()
      : undefined
    if (controller) {
      field.controller = controller
    }

    // Callbacks are DOM events: valuechange as it changes, valuecommit when it settles.
    const live = slot.querySelector("[data-live]")
    const show = (value: number | null) =>
      live && (live.textContent = `value: ${describe(value)}`)
    show((variant.options?.defaultValue ?? null) as number | null)
    field.addEventListener("valuechange", (event) => {
      const { value, reason } = (
        event as CustomEvent<{ value: number | null; reason: string }>
      ).detail
      log.change(`${describe(value)} (${reason})`)
      show(value)
    })
    field.addEventListener("valuecommit", (event) => {
      const { value, reason } = (
        event as CustomEvent<{ value: number | null; reason: string }>
      ).detail
      log.commit(`${describe(value)} (${reason})`)
    })
    // Web components are uncontrolled. Controlled variants set the live `value` property instead.
    slot.querySelectorAll<HTMLElement>("[data-preset]").forEach((button) =>
      button.addEventListener("click", () => {
        const preset = variant.presets![Number(button.dataset.preset)]
        if (controller) {
          controller.setValue(preset)
        } else {
          field.value = preset
        }
      })
    )
    slot
      .querySelector("[data-decrement]")
      ?.addEventListener("click", () => controller!.decrement())
    slot
      .querySelector("[data-increment]")
      ?.addEventListener("click", () => controller!.increment({ large: true }))
    slot
      .querySelector("[data-focus]")
      ?.addEventListener("click", () => controller!.focus())
  })
  await import("@ui-sdk/web/number-input")
  await import("@ui-sdk/web/field")
}

export { mount }
