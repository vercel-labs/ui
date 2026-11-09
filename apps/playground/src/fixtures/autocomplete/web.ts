import { createAsyncOptions } from "@ui-sdk/core/async-options"
import {
  autocompleteFixture as f,
  autocompleteOptions,
  changedItems,
  searchFruits,
} from "tests/fixtures/autocomplete.ts"
import { onItemsChange } from "tests/fixtures/items.ts"
import { serializeForm } from "tests/fixtures/select.ts"

// The highlight option wraps labels in a text part that marks what matched.
let highlight = false

const item = (entry: {
  value: string
  label: string
  keywords?: string[]
  disabled?: boolean
}) =>
  `<ui-autocomplete-item class="item" value="${entry.value}" label="${entry.label}"${entry.keywords ? ` keywords="${entry.keywords.join(",")}"` : ""}${entry.disabled ? " disabled" : ""}>${highlight ? `<ui-autocomplete-item-text>${entry.label}</ui-autocomplete-item-text>` : entry.label}</ui-autocomplete-item>`

async function render(root: HTMLElement, data = false) {
  const { fieldset, grouped, async, container, recent, nostatus, ...options } =
    autocompleteOptions()
  highlight = options.highlight
  const dataMode = data || async || recent
  const list = grouped
    ? f.groups
        .map(
          (group) =>
            `<ui-autocomplete-group><ui-autocomplete-group-label class="label">${group.label}</ui-autocomplete-group-label>${group.items.map(item).join("")}</ui-autocomplete-group>`
        )
        .join("")
    : f.items.map(item).join("")
  const control = `
    <ui-autocomplete name="${f.name}">
      <ui-autocomplete-label class="label">${f.label}</ui-autocomplete-label>
      <ui-autocomplete-input><input class="input" /></ui-autocomplete-input>
      <ui-autocomplete-trigger><button type="button" aria-label="${f.trigger}">▾</button></ui-autocomplete-trigger>
      <ui-autocomplete-clear><button type="button">${f.clear}</button></ui-autocomplete-clear>
      <ui-autocomplete-content class="popup list-popup">
        ${nostatus ? "" : '<ui-autocomplete-status class="status"></ui-autocomplete-status>'}
        <ui-autocomplete-empty class="empty">${f.empty}</ui-autocomplete-empty>
        <ui-autocomplete-list>${dataMode ? "" : list}</ui-autocomplete-list>
      </ui-autocomplete-content>
      <template>
        <ui-autocomplete-item class="item">${highlight ? "<ui-autocomplete-item-text></ui-autocomplete-item-text>" : ""}</ui-autocomplete-item>
        <ui-autocomplete-group-label class="label"></ui-autocomplete-group-label>
      </template>
    </ui-autocomplete>`
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <form class="select-form" aria-label="${f.formLabel}">
        ${fieldset ? `<fieldset disabled>${control}</fieldset>` : control}
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </form>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
      <output role="status" aria-label="Submitted"></output>
    </div>`
  const autocomplete = root.querySelector<HTMLElement & Record<string, any>>(
    "ui-autocomplete"
  )!
  if (options.defaultValue !== undefined) {
    autocomplete.setAttribute("default-value", options.defaultValue)
  }
  for (const [option, attribute] of [
    ["inlineComplete", "inline-complete"],
    ["autoHighlight", "auto-highlight"],
    ["openOnFocus", "open-on-focus"],
    ["submitOnSelect", "submit-on-select"],
    ["required", "required"],
    ["readOnly", "read-only"],
    ["disabled", "disabled"],
  ] as const) {
    if (options[option]) {
      autocomplete.setAttribute(attribute, "")
    }
  }
  if (container) {
    autocomplete.setAttribute("container", `#${container.id}`)
  }
  if (options.presentation) {
    autocomplete.setAttribute("presentation", options.presentation)
  }
  if (recent) {
    autocomplete.emptyItems = f.recent
  }
  const output = root.querySelector<HTMLOutputElement>(
    'output[aria-label="Last action"]'
  )!
  const status = root.querySelector("ui-autocomplete-status")
  if (async) {
    autocomplete.setAttribute("filter", "false")
    const remote = createAsyncOptions(searchFruits, { immediate: true })
    remote.subscribe(() => {
      const { items, status: loading } = remote.getState()
      autocomplete.items = items
      autocomplete.setAttribute("status", loading)
      if (status) {
        status.textContent = loading === "loading" ? "Loading…" : ""
      }
    })
    autocomplete.addEventListener("valuechange", (event) =>
      remote.setQuery((event as CustomEvent<{ value: string }>).detail.value)
    )
  } else if (dataMode) {
    autocomplete.items = grouped
      ? f.groups.map((group) => ({
          type: "group",
          label: group.label,
          items: group.items,
        }))
      : f.items
  }
  autocomplete.addEventListener("valuechange", (event) => {
    const { value, reason } = (
      event as CustomEvent<{ value: string; reason: string }>
    ).detail
    output.textContent = `value:${value}:${reason}`
  })
  autocomplete.addEventListener("submit", (event) => {
    output.textContent = `submit:${(event as unknown as CustomEvent<{ value: string }>).detail.value}`
  })
  if (!async && !grouped) {
    onItemsChange(changedItems, (items) => {
      if (dataMode) {
        return void (autocomplete.items = items)
      }
      // Moves the items that stay, so they keep their elements, and adds the new
      // ones. The list may be in a portal container, outside the autocomplete.
      const list = document.querySelector("ui-autocomplete-list")!
      const existing = new Map(
        [...list.querySelectorAll<HTMLElement>("ui-autocomplete-item")].map(
          (el) => [el.getAttribute("value"), el]
        )
      )
      list.replaceChildren(
        ...items.map(
          (entry) =>
            existing.get(entry.value) ??
            document.createRange().createContextualFragment(item(entry))
        )
      )
    })
  }
  const form = root.querySelector("form")!
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    root.querySelector<HTMLOutputElement>(
      'output[aria-label="Submitted"]'
    )!.textContent = serializeForm(form)
  })
  await import("@ui-sdk/web/autocomplete")
}

function mount(root: HTMLElement) {
  return render(root)
}

export { mount, render }
