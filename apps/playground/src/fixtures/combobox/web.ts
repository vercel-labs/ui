import { createAsyncOptions } from "@ui-sdk/core/async-options"
import {
  cancelsValue,
  changedItems,
  comboboxFixture as f,
  comboboxOptions,
  createDelay,
  searchCountries,
  searchCountryPages,
} from "tests/fixtures/combobox.ts"
import { onItemsChange } from "tests/fixtures/items.ts"
import { longItems, serializeForm } from "tests/fixtures/select.ts"

// The highlight option wraps labels in a text part that marks what matched.
let highlight = false

const item = (entry: { value: string; label: string; keywords?: string[]; disabled?: boolean }) =>
  `<ui-combobox-item class="item" value="${entry.value}" label="${entry.label}"${entry.keywords ? ` keywords="${entry.keywords.join(",")}"` : ""}${entry.disabled ? " disabled" : ""}>${highlight ? `<ui-combobox-item-text>${entry.label}</ui-combobox-item-text>` : entry.label}<ui-combobox-item-indicator class="indicator">✓</ui-combobox-item-indicator></ui-combobox-item>`

const selectAllOption = (label: string) =>
  `<ui-combobox-select-all class="item">${label}</ui-combobox-select-all>`

async function render(root: HTMLElement, data = false) {
  const {
    fieldset,
    grouped,
    create,
    slow,
    async,
    long,
    container,
    recent,
    selectAll,
    overflow,
    pages,
    nostatus,
    cancel,
    ...options
  } = comboboxOptions()
  highlight = options.highlight
  const remoteMode = async || pages
  const dataMode = data || remoteMode || long || recent
  const list = grouped
    ? f.groups
        .map(
          (group) =>
            `<ui-combobox-group><ui-combobox-group-label class="label">${group.label}</ui-combobox-group-label>${selectAll ? selectAllOption(`${f.selectAll} ${group.label}`) : ""}${group.items.map(item).join("")}</ui-combobox-group>`,
        )
        .join("")
    : f.items.map(item).join("")
  const allOption = selectAll && (dataMode || !grouped) ? selectAllOption(f.selectAll) : ""
  const overflowPart = overflow
    ? '<ui-combobox-chips-overflow class="chips-overflow"></ui-combobox-chips-overflow>'
    : ""
  const input = '<ui-combobox-input><input class="input" /></ui-combobox-input>'
  const control = `
    <ui-combobox name="${f.name}">
      <ui-combobox-label class="label">${f.label}</ui-combobox-label>
      ${options.multiple ? `<ui-combobox-chips class="${overflow ? "chips chips-line" : "chips"}">${overflowPart}${input}</ui-combobox-chips>` : input}
      <ui-combobox-trigger><button aria-label="${f.trigger}">▾</button></ui-combobox-trigger>
      <ui-combobox-clear><button>${f.clear}</button></ui-combobox-clear>
      <ui-combobox-content class="popup list-popup${pages ? " list-short" : ""}">
        ${nostatus ? "" : '<ui-combobox-status class="status"></ui-combobox-status>'}
        <ui-combobox-empty class="empty">${f.empty}</ui-combobox-empty>
        <ui-combobox-list>${allOption}${dataMode ? "" : list}${create ? '<ui-combobox-create class="item"></ui-combobox-create>' : ""}</ui-combobox-list>
      </ui-combobox-content>
      <template>
        <ui-combobox-item class="item">${highlight ? "<ui-combobox-item-text></ui-combobox-item-text>" : ""}<ui-combobox-item-indicator class="indicator">✓</ui-combobox-item-indicator></ui-combobox-item>
        <ui-combobox-group-label class="label"></ui-combobox-group-label>
        <ui-combobox-chip class="chip"></ui-combobox-chip>
      </template>
    </ui-combobox>`
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
  const combobox = root.querySelector<HTMLElement & Record<string, any>>("ui-combobox")!
  if (options.multiple) combobox.setAttribute("multiple", "")
  if (options.maxSelected) combobox.setAttribute("max-selected", String(options.maxSelected))
  if (options.defaultValue !== undefined)
    combobox.setAttribute("default-value", ([] as string[]).concat(options.defaultValue).join(","))
  for (const name of ["required", "disabled"] as const) if (options[name]) combobox.setAttribute(name, "")
  if (options.readOnly) combobox.setAttribute("read-only", "")
  if (options.autoHighlight) combobox.setAttribute("auto-highlight", "")
  if (container) combobox.setAttribute("container", `#${container.id}`)
  if (options.presentation) combobox.setAttribute("presentation", options.presentation)
  if (options.modal === false) combobox.setAttribute("modal", "false")
  const all = [...f.items]
  combobox.itemToLabel = (value: string) => all.find((entry) => entry.value === value)?.label ?? value
  if (recent) combobox.emptyItems = f.recent
  if (dataMode) {
    combobox.items = long
      ? longItems()
      : grouped
        ? f.groups.map((group) => ({ type: "group", label: group.label, items: group.items }))
        : all
  }
  const output = root.querySelector<HTMLOutputElement>('output[aria-label="Last action"]')!
  const status = root.querySelector("ui-combobox-status")
  if (remoteMode) {
    combobox.setAttribute("filter", "false")
    const remote = createAsyncOptions(pages ? searchCountryPages : searchCountries, { immediate: true })
    remote.subscribe(() => {
      const { items, status: loading } = remote.getState()
      combobox.items = items
      combobox.setAttribute("status", loading)
      if (status) status.textContent = loading === "loading" ? (pages ? "Loading more…" : "Loading…") : ""
    })
    combobox.addEventListener("querychange", (event) =>
      remote.setQuery((event as CustomEvent<{ value: string }>).detail.value),
    )
    combobox.addEventListener("loadmore", () => remote.loadMore())
  }
  combobox.addEventListener("valuechange", (event) => {
    const value = (event as CustomEvent<{ value: unknown }>).detail.value
    if (cancelsValue(value, cancel)) return event.preventDefault()
    output.textContent = `value:${Array.isArray(value) ? value.join(",") : String(value)}`
  })
  combobox.addEventListener("create", (event) => {
    const { value, waitUntil } = (
      event as CustomEvent<{ value: string; waitUntil: (p: Promise<unknown>) => void }>
    ).detail
    output.textContent = `create:${value}`
    waitUntil(
      Promise.resolve(createDelay(slow)).then(() => {
        all.push({ value: value.toLowerCase(), label: value })
        // The list may render in a portal container.
        const list = document.querySelector("ui-combobox-list")!
        list.insertBefore(
          document.createRange().createContextualFragment(item({ value: value.toLowerCase(), label: value })),
          list.querySelector("ui-combobox-create"),
        )
      }),
    )
  })
  if (!remoteMode && !long && !grouped)
    onItemsChange(changedItems, (items) => {
      all.push(...items.filter((entry) => !all.some((known) => known.value === entry.value)))
      if (dataMode) return void (combobox.items = items)
      // Moves the items that stay, so they keep their elements, and adds the new
      // ones. The list may render in a portal container.
      const list = document.querySelector("ui-combobox-list")!
      const existing = new Map(
        [...list.querySelectorAll<HTMLElement>("ui-combobox-item")].map((el) => [
          el.getAttribute("value"),
          el,
        ]),
      )
      list.replaceChildren(
        ...list.querySelectorAll("ui-combobox-select-all"),
        ...items.map(
          (entry) =>
            existing.get(entry.value) ?? document.createRange().createContextualFragment(item(entry)),
        ),
        ...list.querySelectorAll("ui-combobox-create"),
      )
    })
  const form = root.querySelector("form")!
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    root.querySelector<HTMLOutputElement>('output[aria-label="Submitted"]')!.textContent = serializeForm(form)
  })
  await import("@ui-sdk/web/combobox")
}

function mount(root: HTMLElement) {
  return render(root)
}

export { mount, render }
