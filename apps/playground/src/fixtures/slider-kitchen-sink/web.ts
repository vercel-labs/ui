import {
  createSliderController,
  type SliderController,
} from "@ui-sdk/core/slider"
import { classes as c } from "./classes"
import { renderShell } from "./shell"
import {
  describe,
  formats,
  thumbLabel,
  thumbsOf,
  type Variant,
} from "./variants"

type SliderElement = HTMLElement & {
  value: number | number[]
  format?: unknown
  controller?: SliderController
}

const kebab = (name: string) =>
  name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)

// Options as attributes, in kebab case. A range is "start/end", like the value it submits.
function attributes(options: Record<string, unknown> = {}) {
  return Object.entries(options)
    .map(([key, value]) => {
      if (value === true) {
        return ` ${kebab(key)}`
      }
      return ` ${kebab(key)}="${Array.isArray(value) ? value.join("/") : value}"`
    })
    .join("")
}

function control(variant: Variant) {
  const thumbs = Array.from({ length: thumbsOf(variant) }, (_, index) => {
    const label = thumbLabel(variant, index)
    const bubble = variant.custom
      ? `<span class="${c.bubble}" data-bubble></span>`
      : ""
    return `<ui-slider-thumb class="${c.thumb}"${label ? ` aria-label="${label}"` : ""}>${bubble}</ui-slider-thumb>`
  }).join("")
  const outside = variant.place === "outside" ? ` form="${variant.id}"` : ""
  // Content in <ui-slider-value> replaces the formatted value, so the custom variant writes its own.
  const value = `<ui-slider-value class="${c.value}">${variant.custom ? "Between" : ""}</ui-slider-value>`
  const presets = variant.presets
    ? `<div class="${c.row}">${variant.presets
        .map(
          (preset, index) =>
            `<button type="button" class="${c.button}" data-preset="${index}">Set ${describe(preset)}</button>`
        )
        .join(
          ""
        )}${variant.controller ? `<button type="button" class="${c.button}" data-focus>Focus last thumb</button>` : ""}</div>`
    : ""
  return `<ui-slider class="${c.root}"${attributes(variant.options)}${outside}>
      ${value}
      <ui-slider-control class="${c.control}">
        <ui-slider-track class="${c.track}">
          <ui-slider-indicator class="${c.indicator}"></ui-slider-indicator>
          ${thumbs}
        </ui-slider-track>
      </ui-slider-control>
    </ui-slider>${variant.controlled ? `<span class="${c.description}" data-live></span>` : ""}${presets}`
}

function card(variant: Variant) {
  let body = control(variant)
  if (variant.place === "field") {
    body = `<ui-field class="${c.form}" name="level">
      <ui-field-label class="${c.label}">Level</ui-field-label>${body}
      <ui-field-description class="${c.description}">Where the level sits.</ui-field-description>
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

// Shows each thumb's value in its bubble and the range after "Between".
function writeCustom(slider: SliderElement, value: number | number[]) {
  const values = Array.isArray(value) ? value : [value]
  slider
    .querySelectorAll("[data-bubble]")
    .forEach((bubble, index) => (bubble.textContent = String(values[index])))
  slider.querySelector("ui-slider-value")!.textContent =
    `Between ${values.join(" – ")}`
}

async function mount(root: HTMLElement) {
  renderShell(root, "web", (slot, variant, log) => {
    slot.innerHTML = card(variant)
    const slider = slot.querySelector<SliderElement>("ui-slider")!
    // Rich options are properties, set here before the elements upgrade.
    if (variant.format) {
      slider.format = formats[variant.format]
    }
    const controller = variant.controller ? createSliderController() : undefined
    if (controller) {
      slider.controller = controller
    }

    // Callbacks are DOM events: valuechange while it moves, valuecommit when it settles.
    slider.addEventListener("valuechange", (event) => {
      const { value, reason, thumb } = (
        event as CustomEvent<{
          value: number | number[]
          reason: string
          thumb: number | null
        }>
      ).detail
      log.change(`${describe(value)} (${reason}, thumb ${thumb})`)
      if (variant.controlled) {
        slot.querySelector("[data-live]")!.textContent =
          `value: ${describe(value)}`
      }
      if (variant.custom) {
        writeCustom(slider, value)
      }
    })
    slider.addEventListener("valuecommit", (event) => {
      const { value, reason } = (
        event as CustomEvent<{ value: number | number[]; reason: string }>
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
          slider.value = preset
        }
      })
    )
    slot
      .querySelector("[data-focus]")
      ?.addEventListener("click", () =>
        controller!.focus(thumbsOf(variant) - 1)
      )
    // The value at first, before any event.
    const initial = (variant.options?.defaultValue ?? 0) as number | number[]
    if (variant.controlled) {
      slot.querySelector("[data-live]")!.textContent =
        `value: ${describe(initial)}`
    }
    if (variant.custom) {
      writeCustom(slider, initial)
    }
  })
  await import("@ui-sdk/web/slider")
  await import("@ui-sdk/web/field")
}

export { mount }
