import type { ListData } from "@ui-sdk/core/select"
import "@ui-sdk/web/select"
import * as classes from "./classes"
import { kitchenSink, show } from "./shell"
import {
  countryOptions,
  defaultValueOf,
  valuePlaceholder,
  listOf,
  recentItems,
  sampleValue,
  type Variant,
} from "./variants"

const kebab = (name: string) => name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)

type SelectElement = HTMLElement & {
  items?: ListData<any>
  itemToValue?: (value: any) => string
  itemToLabel?: (value: any) => string
  value?: unknown
  controller?: unknown
  api?: { open: () => void; close: () => void }
}

function item(entry: { value: string; label: string; disabled?: boolean }, variant: Variant) {
  return `<ui-select-item class="${classes.item}" value="${entry.value}"${entry.disabled ? " disabled" : ""}><ui-select-item-indicator class="${classes.indicator}"${variant.indicatorKeepMounted ? " keep-mounted" : ""}>✓</ui-select-item-indicator><ui-select-item-text class="[&_mark]:bg-transparent [&_mark]:font-semibold [&_mark]:underline">${entry.label}</ui-select-item-text></ui-select-item>`
}

// The parts a data select copies for what it renders: its content, and items with their check.
function template(variant: Variant) {
  return `<template>
    <ui-select-content class="${classes.content(variant.animation)}"></ui-select-content>
    <ui-select-item class="${classes.item}"><ui-select-item-indicator class="${classes.indicator}"${variant.indicatorKeepMounted ? " keep-mounted" : ""}>✓</ui-select-item-indicator><ui-select-item-text class="[&_mark]:bg-transparent [&_mark]:font-semibold [&_mark]:underline"></ui-select-item-text></ui-select-item>
    <ui-select-group-label class="${classes.groupLabel}"></ui-select-group-label>
    <ui-select-separator class="${classes.separator}"></ui-select-separator>
  </template>`
}

// Composed items as markup. Groups hold only items.
function items(list: ListData<any>, variant: Variant) {
  return list
    .map((entry) => {
      if (typeof entry === "string") return ""
      if ("type" in entry && entry.type === "separator")
        return `<ui-select-separator class="${classes.separator}"></ui-select-separator>`
      if ("type" in entry && entry.type === "group")
        return `<ui-select-group><ui-select-group-label class="${classes.groupLabel}">${entry.label}</ui-select-group-label>${variant.selectAll ? `<ui-select-select-all class="${classes.selectAll}">All ${entry.label}</ui-select-select-all>` : ""}${entry.items
          .map((child: unknown) => (typeof child === "string" ? "" : item(child as never, variant)))
          .join("")}</ui-select-group>`
      return item(entry as never, variant)
    })
    .join("")
}

// A select-all option over the whole list. Grouped lists put one in each group instead.
function selectAllOption(variant: Variant) {
  if (!variant.selectAll || variant.list === "grouped") return ""
  return `<ui-select-select-all class="${classes.selectAll}">Select all</ui-select-select-all>`
}

function attributes(values: Record<string, unknown>) {
  return Object.entries(values)
    .filter(([, value]) => value !== undefined && value !== false)
    .map(([name, value]) => (value === true ? kebab(name) : `${kebab(name)}="${value}"`))
    .join(" ")
}

function mount(root: HTMLElement) {
  kitchenSink(root, "web", (slot, variant, env) => {
    const select = document.createElement("ui-select") as SelectElement
    const { defaultValue, ...options } = variant.options ?? {}
    for (const [option, value] of Object.entries(options)) select.setAttribute(kebab(option), String(value))
    // Web components have no controlled value: the value attribute starts it, and the buttons set the property.
    if (defaultValue !== undefined) select.setAttribute("default-value", [defaultValue].flat().join(","))
    if (env.container) select.setAttribute("container", `#${env.container.id}`)
    const data = variant.mode === "data"
    const list = listOf(variant)
    if (data) select.items = list
    if (variant.recent) Object.assign(select, { emptyItems: recentItems })
    if (variant.list === "countries") Object.assign(select, countryOptions)

    const content = attributes({
      ...variant.content,
      ...(env.anchor && { anchor: `#${env.anchor.id}` }),
    })
    select.innerHTML = `
      <ui-select-label class="${classes.label}">${variant.title}</ui-select-label>
      <ui-select-trigger${variant.triggerDisabled ? " disabled" : ""}>
        <button class="${classes.trigger}"><ui-select-value class="${classes.value}" ${attributes({ placeholder: valuePlaceholder(variant), maxLabels: variant.max })}></ui-select-value><span class="${classes.chevron}" aria-hidden="true">▾</span></button>
      </ui-select-trigger>
      ${variant.clear ? `<ui-select-clear${variant.clear === "keep-mounted" ? " keep-mounted" : ""}><button class="${classes.clear}">Clear</button></ui-select-clear>` : ""}
      ${
        variant.search
          ? `<ui-select-content class="${classes.content(variant.animation)}" ${content}>
              <ui-select-input><input class="${classes.search}" aria-label="Search" placeholder="Search…" /></ui-select-input>
              <ui-select-empty class="${classes.empty}">Nothing found</ui-select-empty>
              <ui-select-list>${data ? "" : `${selectAllOption(variant)}${items(list, variant)}`}</ui-select-list>
            </ui-select-content>`
          : data
            ? ""
            : `<ui-select-content class="${classes.content(variant.animation, variant.arrow)}" ${content}>
              ${variant.arrow ? `<ui-select-arrow class="${classes.arrow}"></ui-select-arrow>` : ""}
              ${selectAllOption(variant)}${items(list, variant)}
            </ui-select-content>`
      }
      ${data ? template(variant) : ""}
    `
    slot.append(select)

    // Web components have no controlled props. The value and open state show here, and buttons drive the element.
    const output = Object.assign(document.createElement("span"), {
      className: "text-xs text-neutral-600",
      textContent: `value: ${show(defaultValueOf(variant) ?? null)}`,
    })
    const checkbox = Object.assign(document.createElement("input"), { type: "checkbox" })
    // Callbacks are DOM events on the element, with the value and the reason in `detail`.
    const detail = (event: Event) =>
      (event as CustomEvent<{ value: unknown; reason?: string; index?: number }>).detail
    select.addEventListener("valuechange", (event) => {
      const { value, reason } = detail(event)
      env.log(`valueChange ${show(value)} (${reason})`)
      if (variant.controlled === "value") output.textContent = `value: ${show(value)}`
    })
    select.addEventListener("openchange", (event) => {
      const { value, reason } = detail(event)
      env.log(`openChange ${value} (${reason})`)
      if (variant.controlled === "open") checkbox.checked = value as boolean
    })
    select.addEventListener("openchangecomplete", (event) =>
      env.log(`openChangeComplete ${detail(event).value}`),
    )
    select.addEventListener("highlight", (event) => {
      const { value, index } = detail(event)
      env.log(`highlight ${show(value)} #${index}`)
    })

    select.controller = env.controller

    if (variant.controlled === "value") {
      const set = Object.assign(document.createElement("button"), {
        type: "button",
        className: classes.button,
        textContent: "Set",
      })
      set.addEventListener("click", () => (select.value = sampleValue(variant)))
      const clear = Object.assign(document.createElement("button"), {
        type: "button",
        className: classes.button,
        textContent: "Null",
      })
      clear.addEventListener("click", () => (select.value = null))
      slot.append(output, set, clear)
    }
    if (variant.controlled === "open") {
      const label = Object.assign(document.createElement("label"), {
        className: "flex items-center gap-1.5 text-xs text-neutral-600",
      })
      label.append(checkbox, "open")
      slot.append(label)
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) select.api?.open()
        else select.api?.close()
      })
    }
  })
}

export { mount }
