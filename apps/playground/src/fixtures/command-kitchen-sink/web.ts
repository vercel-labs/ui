import { createAsyncOptions } from "@ui-sdk/core/async-options"
import { type CommandData, type CommandDataItem } from "@ui-sdk/core/command"
import "@ui-sdk/web/command"
import "@ui-sdk/web/dialog"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import {
  filterOf,
  listOf,
  pagesOf,
  runner,
  search,
  type Variant,
} from "./variants"

const kebab = (name: string) =>
  name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)

type CommandElement = HTMLElement & {
  items?: CommandData
  filter?: unknown
  controller?: object
  value?: string | null
  query?: string
  pages?: string[]
}

type ActionDetail = {
  value: string
  waitUntil: (promise: Promise<unknown>) => void
}

function item(entry: CommandDataItem | string) {
  if (typeof entry === "string") {
    return `<ui-command-item class="${classes.item}" value="${entry}">${entry}</ui-command-item>`
  }
  return `<ui-command-item class="${classes.item}" value="${entry.value}" label="${entry.label}"${entry.keywords ? ` keywords="${entry.keywords.join(",")}"` : ""}${entry.disabled ? " disabled" : ""}${entry.shortcut ? ` shortcut="${entry.shortcut}"` : ""}${entry.items ? ` page="${entry.value}"` : ""}>${entry.label}${entry.shortcut ? `<ui-command-shortcut class="${classes.shortcut}"></ui-command-shortcut>` : ""}</ui-command-item>`
}

// Composed commands as markup. Groups hold only commands.
function items(list: CommandData) {
  return list
    .map((entry) => {
      if (typeof entry === "string") {
        return item(entry)
      }
      if ("type" in entry && entry.type === "separator") {
        return `<ui-command-separator class="${classes.separator}"></ui-command-separator>`
      }
      if ("type" in entry && entry.type === "group") {
        return `<ui-command-group><ui-command-group-label class="${classes.groupLabel}">${entry.label}</ui-command-group-label>${entry.items.map(item).join("")}</ui-command-group>`
      }
      return item(entry as CommandDataItem)
    })
    .join("")
}

// The list's markup: its commands, with a CommandPage for the first page and each nested one.
function composed(list: CommandData) {
  const nested = pagesOf(list)
  if (!nested.length) {
    return items(list)
  }
  return `<ui-command-page>${items(list)}</ui-command-page>${nested
    .map(
      (page) =>
        `<ui-command-page value="${page.value}">${items(page.items)}</ui-command-page>`
    )
    .join("")}`
}

// The parts a data command copies for its items, group labels and separators.
const template = `<template>
  <ui-command-item class="${classes.item}"><ui-command-shortcut class="${classes.shortcut}"></ui-command-shortcut></ui-command-item>
  <ui-command-group-label class="${classes.groupLabel}"></ui-command-group-label>
  <ui-command-separator class="${classes.separator}"></ui-command-separator>
</template>`

function button(label: string, run: () => void) {
  const el = Object.assign(document.createElement("button"), {
    type: "button",
    className: classes.button,
  })
  el.textContent = label
  el.addEventListener("click", run)
  return el
}

function commandElement(variant: Variant, env: Env, onRan?: () => void) {
  const command = document.createElement("ui-command") as CommandElement
  command.className = variant.dialog ? classes.dialogRoot : classes.root
  const {
    defaultValue,
    defaultQuery,
    defaultPages,
    filter,
    status,
    ...options
  } = variant.options ?? {}
  for (const [option, value] of Object.entries(options)) {
    command.setAttribute(kebab(option), String(value))
  }
  if (defaultValue !== undefined) {
    command.setAttribute("default-value", defaultValue)
  }
  if (defaultQuery !== undefined) {
    command.setAttribute("default-query", defaultQuery)
  }
  if (defaultPages) {
    command.setAttribute("default-pages", defaultPages.join(","))
  }
  if (status) {
    command.setAttribute("status", status)
  }
  // Named filters are an attribute. A function, or false, is the `filter` property.
  if (typeof filter === "string" && filter !== "function") {
    command.setAttribute("filter", filter)
  } else if (filter !== undefined) {
    command.filter = filterOf(variant)
  }
  if (env.controller) {
    command.controller = env.controller
  }
  const data = variant.mode === "data" || !!variant.async
  if (data) {
    command.items = variant.async ? [] : listOf(variant)
  }

  command.innerHTML = `
    <div data-breadcrumb class="${classes.breadcrumb}" hidden></div>
    <ui-command-input><input class="${classes.input}" aria-label="${variant.title}" placeholder="Type a command…" /></ui-command-input>
    ${variant.async || status ? `<ui-command-status class="${classes.status}">${status === "loading" ? "Loading…" : status === "error" ? "Couldn't load commands." : ""}</ui-command-status>` : ""}
    <ui-command-empty class="${classes.empty}">No results found.</ui-command-empty>
    <ui-command-list class="${classes.list}">${data ? "" : composed(listOf(variant))}</ui-command-list>
    ${data ? template : ""}
  `

  // Callbacks are DOM events on the element, with the value and the reason in `detail`.
  const detail = (event: Event) =>
    (event as CustomEvent<{ value: unknown; reason?: string; index?: number }>)
      .detail
  const breadcrumb = command.querySelector<HTMLElement>("[data-breadcrumb]")!
  const showPages = (pages: string[]) => {
    breadcrumb.hidden = !pages.length
    breadcrumb.textContent = `Home / ${pages.join(" / ")}`
  }
  showPages(defaultPages ?? [])
  command.addEventListener("valuechange", (event) => {
    const { value, reason, index } = detail(event)
    env.log(`valueChange ${JSON.stringify(value)} #${index} (${reason})`)
  })
  command.addEventListener("querychange", (event) => {
    const { value, reason } = detail(event)
    env.log(`queryChange ${JSON.stringify(value)} (${reason})`)
  })
  command.addEventListener("pageschange", (event) => {
    const { value, reason } = detail(event)
    env.log(`pagesChange ${JSON.stringify(value)} (${reason})`)
    showPages(value as string[])
  })
  // Items fire `select` before the command runs. The input's own `select`, for selected text, is skipped.
  command.addEventListener("select", (event) => {
    const target = event.target as Element
    if (target.matches("ui-command-item")) {
      env.log(`select ${target.getAttribute("value")}`)
    }
  })
  // `action` hands `waitUntil()`, so a Promise keeps the command pending. Web items have no callback that
  // returns one, so `select` variants wait here too.
  const run = runner(variant.action ?? variant.select, env.log, "action")
  command.addEventListener("action", (event) => {
    const { value, waitUntil } = (event as CustomEvent<ActionDetail>).detail
    onRan?.()
    const pending = run(value)
    // The command's error state takes the rejection. Web components can't show it, so it's logged.
    if (pending) {
      waitUntil(pending)
    }
  })

  // Async results: the helper loads for the text, and its state feeds the element.
  if (variant.async) {
    const remote = createAsyncOptions(search(variant.async), {
      immediate: true,
    })
    const statusPart = command.querySelector("ui-command-status")!
    command.setAttribute("filter", "false")
    remote.subscribe(() => {
      const state = remote.getState()
      command.items = state.items
      command.setAttribute("status", state.status)
      statusPart.textContent =
        state.status === "loading"
          ? "Loading…"
          : state.status === "error"
            ? "Couldn't load commands."
            : `${state.items.length} results`
    })
    command.addEventListener("querychange", (event) =>
      remote.setQuery(detail(event).value as string)
    )
  }
  return command
}

function mount(root: HTMLElement) {
  kitchenSink(root, "web", (slot, variant, env) => {
    if (variant.dialog) {
      // A command palette: the list in a dialog that ⌘K or Ctrl+K opens. Running a command closes it.
      const dialog = document.createElement("ui-dialog") as HTMLElement & {
        api?: { close: () => void }
      }
      dialog.innerHTML = `
        <ui-dialog-trigger shortcut="mod+k"><button class="${classes.trigger}">Open command palette <ui-dialog-shortcut class="${classes.shortcut}"></ui-dialog-shortcut></button></ui-dialog-trigger>
        <ui-dialog-backdrop class="${classes.dialogBackdrop}"></ui-dialog-backdrop>
        <ui-dialog-content class="${classes.dialogContent}">
          <ui-dialog-title class="sr-only">Command palette</ui-dialog-title>
        </ui-dialog-content>
      `
      dialog
        .querySelector("ui-dialog-content")!
        .append(commandElement(variant, env, () => dialog.api?.close()))
      dialog.addEventListener("openchange", (event) => {
        if (event.target !== dialog) {
          return
        }
        const { value, reason } = (
          event as CustomEvent<{ value: boolean; reason: string }>
        ).detail
        env.log(`dialog openChange ${value} (${reason})`)
      })
      slot.append(dialog)
      return
    }

    const command = commandElement(variant, env)
    slot.append(command)

    // Web components have no controlled props. The state shows here, and buttons drive the element.
    const output = Object.assign(document.createElement("span"), {
      className: "text-xs text-neutral-600",
    })
    if (variant.controlled === "value") {
      output.textContent = `value: ${JSON.stringify(command.value ?? null)}`
      command.addEventListener("valuechange", (event) => {
        output.textContent = `value: ${JSON.stringify((event as CustomEvent<{ value: string | null }>).detail.value)}`
      })
      slot.append(
        output,
        button("Set “billing”", () => (command.value = "billing")),
        button("Null", () => (command.value = null))
      )
    }
    if (variant.controlled === "query") {
      output.textContent = `query: ""`
      command.addEventListener("querychange", (event) => {
        output.textContent = `query: ${JSON.stringify((event as CustomEvent<{ value: string }>).detail.value)}`
      })
      slot.append(
        output,
        button("Set “cal”", () => (command.query = "cal")),
        button("Empty", () => (command.query = ""))
      )
    }
    if (variant.controlled === "pages") {
      output.textContent = `pages: []`
      command.addEventListener("pageschange", (event) => {
        output.textContent = `pages: ${JSON.stringify((event as CustomEvent<{ value: string[] }>).detail.value)}`
      })
      slot.append(
        output,
        button("Theme", () => (command.pages = ["theme"])),
        button("Accent", () => (command.pages = ["theme", "accent"])),
        button("Home", () => (command.pages = []))
      )
    }
  })
}

export { mount }
