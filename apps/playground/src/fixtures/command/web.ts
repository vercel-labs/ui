import {
  commandData,
  commandFixture as f,
  commandOptions,
  runAction,
} from "tests/fixtures/command.ts"
import { longItems } from "tests/fixtures/select.ts"

type Item = {
  value: string
  label: string
  keywords?: string[]
  disabled?: boolean
  shortcut?: string
  page?: string
}

// The highlight option wraps labels in a text part that marks what matched.
let highlight = false

const item = (entry: Item) =>
  `<ui-command-item class="item" value="${entry.value}"${entry.keywords ? ` keywords="${entry.keywords.join(",")}"` : ""}${entry.disabled ? " disabled" : ""}${entry.shortcut ? ` shortcut="${entry.shortcut}"` : ""}${entry.page ? ` page="${entry.page}"` : ""}>${highlight ? `<ui-command-item-text>${entry.label}</ui-command-item-text>` : entry.label}${entry.shortcut ? '<ui-command-shortcut class="shortcut"></ui-command-shortcut>' : ""}</ui-command-item>`

async function render(root: HTMLElement, data = false) {
  const { slow, fail, long, ...options } = commandOptions()
  highlight = options.highlight
  const dataMode = data || long
  const list = f.groups
    .map(
      (group, index) =>
        `${index ? '<ui-command-separator class="separator"></ui-command-separator>' : ""}<ui-command-group><ui-command-group-label class="label">${group.label}</ui-command-group-label>${group.items.map(item).join("")}</ui-command-group>`
    )
    .join("")
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <ui-command class="command">
        <ui-command-input><input class="input" aria-label="${f.input}" /></ui-command-input>
        <ui-command-empty class="empty">${f.empty}</ui-command-empty>
        <ui-command-status class="status"></ui-command-status>
        <ui-command-list class="command-list">${
          dataMode
            ? ""
            : `<ui-command-page>${list}</ui-command-page><ui-command-page value="theme">${f.theme.map(item).join("")}</ui-command-page>`
        }</ui-command-list>
        <template>
          <ui-command-item class="item">${highlight ? "<ui-command-item-text></ui-command-item-text>" : ""}<ui-command-shortcut class="shortcut"></ui-command-shortcut></ui-command-item>
          <ui-command-group-label class="label"></ui-command-group-label>
        </template>
      </ui-command>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
      <output role="status" aria-label="Last highlight"></output>
    </div>`
  const command = root.querySelector<HTMLElement & Record<string, any>>(
    "ui-command"
  )!
  if (options.defaultValue !== undefined) {
    command.setAttribute("default-value", options.defaultValue)
  }
  if (options.defaultPages) {
    command.setAttribute("default-pages", options.defaultPages.join(","))
  }
  if (options.autoHighlight === false) {
    command.setAttribute("auto-highlight", "false")
  }
  if (options.filter) {
    command.setAttribute("filter", options.filter)
  }
  if (options.status) {
    command.setAttribute("status", options.status)
    root.querySelector("ui-command-status")!.textContent = "Loading…"
  }
  if (dataMode) {
    command.items = long ? longItems() : commandData()
  }
  const output = root.querySelector<HTMLOutputElement>(
    'output[aria-label="Last action"]'
  )!
  const lastHighlight = root.querySelector<HTMLOutputElement>(
    'output[aria-label="Last highlight"]'
  )!
  command.addEventListener("valuechange", (event) => {
    const { value, reason } = (
      event as CustomEvent<{ value: string | null; reason: string }>
    ).detail
    lastHighlight.textContent = `${value}:${reason}`
  })
  command.addEventListener("action", (event) => {
    const { value, waitUntil } = (
      event as CustomEvent<{
        value: string
        waitUntil: (p: Promise<unknown>) => void
      }>
    ).detail
    output.textContent = `action:${value}`
    const pending = runAction(slow, fail)
    if (pending) {
      waitUntil(pending)
    }
  })
  await import("@ui-sdk/web/command")
}

function mount(root: HTMLElement) {
  return render(root)
}

export { mount, render }
