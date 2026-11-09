import { createAsyncOptions } from "@ui-sdk/core/async-options"
import { type ListData } from "@ui-sdk/core/autocomplete"
import "@ui-sdk/web/autocomplete"
import * as classes from "./classes"
import { kitchenSink } from "./shell"
import { anchorOf, filterOf, listOf, search } from "./variants"

const kebab = (name: string) =>
  name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)

type AutocompleteElement = HTMLElement & {
  items?: ListData<string>
  filter?: unknown
  value?: string
  controller?: object
  api?: { open: () => void; close: () => void }
}

function item(entry: {
  value: string
  label: string
  keywords?: string[]
  disabled?: boolean
}) {
  return `<ui-autocomplete-item class="${classes.item}" value="${entry.value}" label="${entry.label}"${entry.keywords ? ` keywords="${entry.keywords.join(",")}"` : ""}${entry.disabled ? " disabled" : ""}>${entry.label}</ui-autocomplete-item>`
}

// Composed suggestions as markup. Groups hold only items.
function items(list: ListData<string>) {
  return list
    .map((entry) => {
      if (typeof entry === "string") {
        return ""
      }
      if ("type" in entry && entry.type === "separator") {
        return `<ui-autocomplete-separator class="${classes.separator}"></ui-autocomplete-separator>`
      }
      if ("type" in entry && entry.type === "group") {
        return `<ui-autocomplete-group><ui-autocomplete-group-label class="${classes.groupLabel}">${entry.label}</ui-autocomplete-group-label>${entry.items
          .map((child) =>
            typeof child === "string" ? "" : item(child as never)
          )
          .join("")}</ui-autocomplete-group>`
      }
      return item(entry as never)
    })
    .join("")
}

// The parts a data autocomplete copies for its content, items, group labels and separators.
function template(animation?: classes.Animation) {
  return `<template>
    <ui-autocomplete-content class="${classes.content(animation)}"></ui-autocomplete-content>
    <ui-autocomplete-item class="${classes.item}"></ui-autocomplete-item>
    <ui-autocomplete-group-label class="${classes.groupLabel}"></ui-autocomplete-group-label>
    <ui-autocomplete-separator class="${classes.separator}"></ui-autocomplete-separator>
  </template>`
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
    const autocomplete = document.createElement(
      "ui-autocomplete"
    ) as AutocompleteElement
    const { defaultValue, filter, ...options } = variant.options ?? {}
    for (const [option, value] of Object.entries(options)) {
      autocomplete.setAttribute(kebab(option), String(value))
    }
    if (defaultValue !== undefined) {
      autocomplete.setAttribute("default-value", defaultValue)
    }
    // Named filters are an attribute. A function, or false, is the `filter` property.
    if (typeof filter === "string" && filter !== "function") {
      autocomplete.setAttribute("filter", filter)
    } else if (filter !== undefined) {
      autocomplete.filter = filterOf(variant)
    }
    if (env.container) {
      autocomplete.setAttribute("container", `#${env.container.id}`)
    }
    if (env.controller) {
      autocomplete.controller = env.controller
    }
    const data = variant.mode === "data" || !!variant.async
    const own = !data || !!variant.async
    if (data) {
      autocomplete.items = variant.async ? [] : listOf(variant)
    }

    autocomplete.innerHTML = `
      <ui-autocomplete-label class="${classes.label}">${variant.title}</ui-autocomplete-label>
      <ui-autocomplete-input><input class="${classes.input}" placeholder="Search fruits…" /></ui-autocomplete-input>
      ${variant.trigger ? `<ui-autocomplete-trigger><button type="button" class="${classes.trigger}" aria-label="Show fruits">▾</button></ui-autocomplete-trigger>` : ""}
      ${variant.clear ? `<ui-autocomplete-clear${variant.clear === "keep-mounted" ? " keep-mounted" : ""}><button type="button" class="${classes.clear}">Clear</button></ui-autocomplete-clear>` : ""}
      ${
        own
          ? `<ui-autocomplete-content class="${classes.content(variant.animation, variant.arrow)}" ${attributes({ ...variant.content, anchor: anchorOf(variant) })}>
              ${variant.arrow ? `<ui-autocomplete-arrow class="${classes.arrow}"></ui-autocomplete-arrow>` : ""}
              ${variant.async ? `<ui-autocomplete-status class="${classes.status}"></ui-autocomplete-status>` : ""}
              <ui-autocomplete-empty class="${classes.empty}">No fruits found.</ui-autocomplete-empty>
              <ui-autocomplete-list${variant.arrow ? ` class="${classes.scrollingList}"` : ""}>${data ? "" : items(listOf(variant))}</ui-autocomplete-list>
            </ui-autocomplete-content>`
          : ""
      }
      ${data ? template(variant.animation) : ""}
    `
    slot.append(autocomplete)

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
    autocomplete.addEventListener("valuechange", (event) => {
      const { value, reason } = detail(event)
      env.log(`valueChange ${JSON.stringify(value)} (${reason})`)
      if (variant.controlled === "value") {
        output.textContent = `value: ${JSON.stringify(value)}`
      }
    })
    autocomplete.addEventListener("openchange", (event) => {
      const { value, reason } = detail(event)
      env.log(`openChange ${value} (${reason})`)
      if (variant.controlled === "open") {
        checkbox.checked = value as boolean
      }
    })
    autocomplete.addEventListener("openchangecomplete", (event) =>
      env.log(`openChangeComplete ${detail(event).value}`)
    )
    autocomplete.addEventListener("highlight", (event) => {
      const { value, index } = detail(event)
      env.log(`highlight ${JSON.stringify(value)} #${index}`)
    })
    // `submit` doesn't bubble, so the form around it never takes it for its own.
    autocomplete.addEventListener("submit", (event) => {
      if (event.target === autocomplete) {
        env.log(`onSubmit ${JSON.stringify(detail(event).value)}`)
      }
    })

    // Async results: the helper loads for the text, and its state feeds the element.
    if (variant.async) {
      const remote = createAsyncOptions(search(variant.async), {
        immediate: true,
      })
      const status = autocomplete.querySelector("ui-autocomplete-status")!
      autocomplete.setAttribute("filter", "false")
      remote.subscribe(() => {
        const state = remote.getState()
        autocomplete.items = state.items
        autocomplete.setAttribute("status", state.status)
        status.textContent =
          state.status === "loading"
            ? "Loading…"
            : state.status === "error"
              ? "Couldn't load fruits."
              : `${state.items.length} results`
      })
      autocomplete.addEventListener("valuechange", (event) =>
        remote.setQuery(detail(event).value as string)
      )
    }

    if (variant.controlled === "value") {
      output.textContent = `value: ${JSON.stringify(defaultValue ?? "")}`
      slot.append(
        output,
        button("Set “Mango”", () => (autocomplete.value = "Mango")),
        button("Empty", () => (autocomplete.value = ""))
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
          autocomplete.api?.open()
        } else {
          autocomplete.api?.close()
        }
      })
    }
  })
}

export { mount }
