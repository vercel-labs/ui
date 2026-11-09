import { createListboxController } from "@ui-sdk/core/listbox"
import type { UiListboxElement } from "@ui-sdk/web"
import * as classes from "./classes"
import { kitchenSink } from "./shell"
import { describe, groups, toppings, variantData } from "./variants"

const leaf = `<svg aria-hidden="true" viewBox="0 0 24 24" class="size-3.5" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 19c8 0 14-6 14-14C11 5 5 11 5 19Zm0 0 7-7"/></svg>`

const kebab = (name: string) =>
  name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)

const item = (
  entry: { value: string; label: string; disabled?: boolean },
  link = false
) => {
  const content = `<ui-listbox-item-icon class="${classes.icon}">${leaf}</ui-listbox-item-icon>${entry.label}<ui-listbox-item-indicator class="${classes.indicator}">✓</ui-listbox-item-indicator>`
  return link
    ? `<ui-listbox-item value="${entry.value}" as-child><a class="${classes.item}" href="#${entry.value}">${content}</a></ui-listbox-item>`
    : `<ui-listbox-item class="${classes.item}" value="${entry.value}"${entry.disabled ? " disabled" : ""}>${content}</ui-listbox-item>`
}

// The parts a data listbox copies for its items, groups, group labels and separators.
const template = `<template>
  <ui-listbox-item class="${classes.item}"><ui-listbox-item-indicator class="${classes.indicator}">✓</ui-listbox-item-indicator></ui-listbox-item>
  <ui-listbox-group class="${classes.group}"></ui-listbox-group>
  <ui-listbox-group-label class="${classes.groupLabel}"></ui-listbox-group-label>
  <ui-listbox-separator class="${classes.separator}"></ui-listbox-separator>
</template>`

async function mount(root: HTMLElement) {
  await import("@ui-sdk/web/field")
  await import("@ui-sdk/web/listbox")
  kitchenSink(root, "web", (slot, variant, env) => {
    const { fieldDisabled, defaultValue, ...options } = (variant.options ??
      {}) as Record<string, unknown>
    const attributes = Object.entries(options)
      .map(([key, value]) =>
        value === true ? kebab(key) : `${kebab(key)}="${value}"`
      )
      .join(" ")
    const start =
      defaultValue === undefined
        ? ""
        : ` default-value="${([] as unknown[]).concat(defaultValue)}"`
    const content = variant.data
      ? template
      : variant.items === "grouped"
        ? groups
            .map(
              (group, index) =>
                `${index ? `<ui-listbox-separator class="${classes.separator}"></ui-listbox-separator>` : ""}<ui-listbox-group class="${classes.group}"><ui-listbox-group-label class="${classes.groupLabel}">${group.label}</ui-listbox-group-label>${group.items.map((entry) => item(entry)).join("")}</ui-listbox-group>`
            )
            .join("")
        : toppings.map((entry) => item(entry, variant.links)).join("")
    const label = variant.field ? "" : ' aria-label="Toppings"'
    const listbox = `<ui-listbox class="${classes.root}"${label} ${attributes}${start}>${content}</ui-listbox>`
    slot.innerHTML = variant.field
      ? `<ui-field${fieldDisabled ? " disabled" : ""} class="flex flex-col gap-1.5">
          <ui-field-label class="${classes.label}">Toppings</ui-field-label>${listbox}
          <ui-field-description class="${classes.description}">Pick what goes on top.</ui-field-description>
        </ui-field>`
      : variant.form
        ? `<form class="flex flex-col items-start gap-2">${listbox}<div class="flex gap-2"><button class="${classes.button}">Submit</button><button type="reset" class="${classes.control}">Reset</button></div></form>`
        : listbox
    const element = slot.querySelector<UiListboxElement>("ui-listbox")!
    if (variant.data) {
      element.items = variantData(variant)
    }
    element.addEventListener("valuechange", (event) => {
      if (variant.cancel) {
        return event.preventDefault()
      }
      env.log(
        `valueChange ${describe(event.detail.value)} (${event.detail.reason}, ${event.detail.source})`
      )
    })
    const form = slot.querySelector("form")
    form?.addEventListener("submit", (event) => {
      event.preventDefault()
      env.log(
        `submit ${new URLSearchParams(new FormData(form) as never).toString()}`
      )
    })
    form?.addEventListener("reset", () => env.log("reset"))
    if (!variant.controller) {
      return
    }
    const controller = createListboxController<string, true>()
    element.controller = controller
    env.controls([
      ["selectAll()", () => controller.selectAll()],
      ["clear()", () => controller.clear()],
      ['setValue(["onion"])', () => controller.setValue(["onion"])],
      ["getValue()", () => controller.getValue()],
      ["focus()", () => controller.focus()],
    ])
  })
}

export { mount }
