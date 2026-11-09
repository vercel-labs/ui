import { createAsyncOptions } from "@ui-sdk/core/async-options"
import { type ListData } from "@ui-sdk/core/combobox"
import "@ui-sdk/web/combobox"
import * as classes from "./classes"
import { kitchenSink, show } from "./shell"
import {
  createHandler,
  defaultValueOf,
  listOf,
  objectOptions,
  recentCountries,
  sampleValue,
  search,
  type Variant,
} from "./variants"

const kebab = (name: string) =>
  name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)

type ComboboxElement = HTMLElement & {
  items?: ListData<any>
  itemToValue?: (value: any) => string
  itemToLabel?: (value: any) => string
  value?: unknown
  query?: string
  controller?: unknown
  api?: { open: () => void; close: () => void }
}

function item(
  entry: {
    value: string
    label: string
    keywords?: string[]
    disabled?: boolean
  },
  variant: Variant
) {
  return `<ui-combobox-item class="${classes.item}" value="${entry.value}" label="${entry.label}"${entry.keywords ? ` keywords="${entry.keywords.join(",")}"` : ""}${entry.disabled ? " disabled" : ""}><ui-combobox-item-indicator class="${classes.indicator}"${variant.indicatorKeepMounted ? " keep-mounted" : ""}>✓</ui-combobox-item-indicator><ui-combobox-item-text class="${classes.itemText}">${entry.label}</ui-combobox-item-text></ui-combobox-item>`
}

// The parts the element copies for what it renders: a data combobox's content and items, and chips
// with their remove button.
function template(variant: Variant) {
  return `<template>
    <ui-combobox-content class="${classes.content(variant.animation)}"></ui-combobox-content>
    <ui-combobox-item class="${classes.item}"><ui-combobox-item-indicator class="${classes.indicator}"${variant.indicatorKeepMounted ? " keep-mounted" : ""}>✓</ui-combobox-item-indicator><ui-combobox-item-text class="${classes.itemText}"></ui-combobox-item-text></ui-combobox-item>
    <ui-combobox-group-label class="${classes.groupLabel}"></ui-combobox-group-label>
    <ui-combobox-separator class="${classes.separator}"></ui-combobox-separator>
    <ui-combobox-chip class="${classes.chip}"><ui-combobox-chip-remove><button class="${classes.chipRemove}">×</button></ui-combobox-chip-remove></ui-combobox-chip>
  </template>`
}

// Composed items as markup. Groups hold only items.
function items(list: ListData<any>, variant: Variant) {
  return list
    .map((entry) => {
      if (typeof entry === "string") {
        return ""
      }
      if ("type" in entry && entry.type === "separator") {
        return `<ui-combobox-separator class="${classes.separator}"></ui-combobox-separator>`
      }
      if ("type" in entry && entry.type === "group") {
        return `<ui-combobox-group><ui-combobox-group-label class="${classes.groupLabel}">${entry.label}</ui-combobox-group-label>${entry.items
          .map((child: unknown) =>
            typeof child === "string" ? "" : item(child as never, variant)
          )
          .join("")}</ui-combobox-group>`
      }
      return item(entry as never, variant)
    })
    .join("")
}

function attributes(values: Record<string, unknown>) {
  return Object.entries(values)
    .filter(([, value]) => value !== undefined && value !== false)
    .map(([name, value]) =>
      value === true ? kebab(name) : `${kebab(name)}="${value}"`
    )
    .join(" ")
}

function button(label: string, run: () => void) {
  const el = Object.assign(document.createElement("button"), {
    type: "button",
    className: classes.button,
  })
  el.textContent = label
  el.addEventListener("click", run)
  return el
}

function mount(root: HTMLElement) {
  kitchenSink(root, "web", (slot, variant, env) => {
    const combobox = document.createElement("ui-combobox") as ComboboxElement
    const { defaultValue, filter, ...options } = variant.options ?? {}
    for (const [option, value] of Object.entries(options)) {
      combobox.setAttribute(kebab(option), String(value))
    }
    if (defaultValue !== undefined) {
      combobox.setAttribute("default-value", [defaultValue].flat().join(","))
    }
    // The filter is an attribute, so a function can't be set: that variant falls back to "contains".
    if (filter !== undefined && filter !== "function") {
      combobox.setAttribute("filter", String(filter))
    }
    if (env.container) {
      combobox.setAttribute("container", `#${env.container.id}`)
    }
    const data = variant.mode === "data" || !!variant.async
    const own = !data || !!variant.async || !!variant.create
    if (data) {
      combobox.items = variant.async ? [] : listOf(variant)
    }
    if (variant.list === "objects") {
      Object.assign(combobox, objectOptions)
    }
    if (variant.recent) {
      Object.assign(combobox, { emptyItems: recentCountries })
    }

    const input = `<ui-combobox-input><input class="${variant.chips ? classes.chipsInput : classes.input}" placeholder="Search countries…" /></ui-combobox-input>`
    combobox.innerHTML = `
      <ui-combobox-label class="${classes.label}">${variant.title}</ui-combobox-label>
      ${variant.chips ? `<ui-combobox-chips class="${variant.overflow ? classes.chipsLine : classes.chips}">${variant.overflow ? `<ui-combobox-chips-overflow class="${classes.overflow}"></ui-combobox-chips-overflow>` : ""}${input}</ui-combobox-chips>` : input}
      ${variant.trigger ? `<ui-combobox-trigger><button class="${classes.trigger}" aria-label="Show countries">▾</button></ui-combobox-trigger>` : ""}
      ${variant.clear ? `<ui-combobox-clear${variant.clear === "keep-mounted" ? " keep-mounted" : ""}><button class="${classes.clear}">Clear</button></ui-combobox-clear>` : ""}
      ${
        own
          ? `<ui-combobox-content class="${classes.content(variant.animation, variant.arrow)}" ${attributes(variant.content ?? {})}>
              ${variant.arrow ? `<ui-combobox-arrow class="${classes.arrow}"></ui-combobox-arrow>` : ""}
              ${variant.async ? `<ui-combobox-status class="${classes.status}"></ui-combobox-status>` : ""}
              <ui-combobox-empty class="${classes.empty}">No countries found.</ui-combobox-empty>
              <ui-combobox-list${variant.arrow ? ` class="${classes.scrollingList}"` : ""}>${variant.selectAll ? `<ui-combobox-select-all class="${classes.selectAll}">Select all</ui-combobox-select-all>` : ""}${data ? "" : items(listOf(variant), variant)}${variant.create ? `<ui-combobox-create class="${classes.create}"></ui-combobox-create>` : ""}</ui-combobox-list>
            </ui-combobox-content>`
          : ""
      }
      ${template(variant)}
    `
    slot.append(combobox)

    // Web components have no controlled props. The state shows here, and buttons drive the element.
    const output = Object.assign(document.createElement("span"), {
      className: "text-xs text-neutral-600",
    })
    const checkbox = Object.assign(document.createElement("input"), {
      type: "checkbox",
    })

    // Callbacks are DOM events on the element, with the value and the reason in `detail`.
    const detail = (event: Event) =>
      (
        event as CustomEvent<{
          value: unknown
          reason?: string
          index?: number
        }>
      ).detail
    combobox.addEventListener("valuechange", (event) => {
      const { value, reason } = detail(event)
      env.log(`valueChange ${show(value)} (${reason})`)
      if (variant.controlled === "value") {
        output.textContent = `value: ${show(value)}`
      }
    })
    combobox.addEventListener("openchange", (event) => {
      const { value, reason } = detail(event)
      env.log(`openChange ${value} (${reason})`)
      if (variant.controlled === "open") {
        checkbox.checked = value as boolean
      }
    })
    combobox.addEventListener("querychange", (event) => {
      const { value, reason } = detail(event)
      env.log(`queryChange ${JSON.stringify(value)} (${reason})`)
      if (variant.controlled === "query") {
        output.textContent = `query: ${JSON.stringify(value)}`
      }
    })
    combobox.addEventListener("openchangecomplete", (event) =>
      env.log(`openChangeComplete ${detail(event).value}`)
    )
    combobox.addEventListener("highlight", (event) => {
      const { value, index } = detail(event)
      env.log(`highlight ${show(value)} #${index}`)
    })

    // The create part fires `create`, and writes its own text. waitUntil marks it pending until the Promise settles.
    if (variant.create) {
      const onCreate = createHandler(variant.create, env.log)
      combobox.addEventListener("create", (event) => {
        const { value, waitUntil } = (
          event as CustomEvent<{
            value: string
            waitUntil: (promise: Promise<unknown>) => void
          }>
        ).detail
        const result = onCreate(value)
        if (result) {
          waitUntil(result)
        }
      })
    }

    // Async results: the helper loads for the text, and its state feeds the element.
    if (variant.async) {
      const remote = createAsyncOptions(search(variant.async), {
        immediate: true,
      })
      const status = combobox.querySelector("ui-combobox-status")!
      combobox.setAttribute("filter", "false")
      remote.subscribe(() => {
        const state = remote.getState()
        combobox.items = state.items
        combobox.setAttribute("status", state.status)
        status.textContent =
          state.status === "loading"
            ? variant.async === "pages"
              ? "Loading more…"
              : "Loading…"
            : state.status === "error"
              ? "Couldn't load countries."
              : `${state.items.length} results`
      })
      combobox.addEventListener("querychange", (event) =>
        remote.setQuery(detail(event).value as string)
      )
      combobox.addEventListener("loadmore", () => remote.loadMore())
    }

    combobox.controller = env.controller

    if (variant.controlled === "value") {
      output.textContent = `value: ${show(defaultValueOf(variant) ?? null)}`
      slot.append(
        output,
        button("Set", () => (combobox.value = sampleValue(variant))),
        button("Null", () => (combobox.value = null))
      )
    }
    if (variant.controlled === "query") {
      output.textContent = `query: ""`
      slot.append(
        output,
        button("Set “ca”", () => (combobox.query = "ca")),
        button("Empty", () => (combobox.query = ""))
      )
    }
    if (variant.controlled === "open") {
      const label = Object.assign(document.createElement("label"), {
        className: "flex items-center gap-1.5 text-xs text-neutral-600",
      })
      label.append(checkbox, "open")
      slot.append(label)
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          combobox.api?.open()
        } else {
          combobox.api?.close()
        }
      })
    }
  })
}

export { mount }
