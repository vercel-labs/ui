import { onItemsChange } from "tests/fixtures/items.ts"
import {
  changedItems,
  longItems,
  selectFixture as f,
  selectOptions,
  serializeForm,
} from "tests/fixtures/select.ts"

const item = (value: string, label: string, disabled?: boolean) =>
  `<ui-select-item class="item" value="${value}"${disabled ? " disabled" : ""}><ui-select-item-text>${label}</ui-select-item-text><ui-select-item-indicator class="indicator">✓</ui-select-item-indicator></ui-select-item>`

// The parts a data select copies for what it renders: the content, and items with their check.
const template = `
  <template>
    <ui-select-content class="popup list-popup"></ui-select-content>
    <ui-select-item class="item"><ui-select-item-text></ui-select-item-text><ui-select-item-indicator class="indicator">✓</ui-select-item-indicator></ui-select-item>
    <ui-select-group-label class="label"></ui-select-group-label>
    <ui-select-separator class="separator"></ui-select-separator>
  </template>`

const selectAllOption = (label: string) =>
  `<ui-select-select-all class="item">${label}</ui-select-select-all>`

async function render(root: HTMLElement, data = false) {
  const {
    fieldset,
    grouped,
    cancel,
    align,
    long,
    container,
    search,
    selectAll,
    recent,
    max,
    ...options
  } = selectOptions()
  const fromData = data || long || recent
  const list = grouped
    ? f.groups
        .map(
          (group, index) =>
            `${index ? '<ui-select-separator class="separator"></ui-select-separator>' : ""}<ui-select-group><ui-select-group-label class="label">${group.label}</ui-select-group-label>${selectAll ? selectAllOption(`${f.selectAll} ${group.label}`) : ""}${group.items.map((entry) => item(entry.value, entry.label)).join("")}</ui-select-group>`
        )
        .join("")
    : f.items
        .map((entry) => item(entry.value, entry.label, entry.disabled))
        .join("")
  const items = `${selectAll && !grouped ? selectAllOption(f.selectAll) : ""}${fromData ? "" : list}`
  const aligned = align ? " align-item-with-trigger" : ""
  const content = search
    ? `<ui-select-content class="popup list-popup"${aligned}><ui-select-input><input class="input" aria-label="${f.search}" /></ui-select-input><ui-select-empty class="empty">${f.empty}</ui-select-empty><ui-select-list>${items}</ui-select-list></ui-select-content>`
    : fromData
      ? selectAll
        ? `<ui-select-content class="popup list-popup"><ui-select-list>${items}</ui-select-list></ui-select-content>`
        : ""
      : `<ui-select-content class="popup list-popup"${aligned}>${items}</ui-select-content>`
  const control = `
    <ui-select name="${f.name}" placeholder="${f.placeholder}">
      <ui-select-label class="label">${f.label}</ui-select-label>
      <ui-select-trigger><button class="trigger"><ui-select-value class="value"${max ? ` max-labels="${max}"` : ""}></ui-select-value><span aria-hidden="true">▾</span></button></ui-select-trigger>
      <ui-select-clear><button>${f.clear}</button></ui-select-clear>
      ${content}${fromData ? template : ""}
    </ui-select>`
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
      <button id="controller">Open with controller</button>
    </div>`
  const select = root.querySelector<HTMLElement & Record<string, any>>(
    "ui-select"
  )!
  if (options.multiple) {
    select.setAttribute("multiple", "")
  }
  if (options.defaultValue !== undefined) {
    select.setAttribute(
      "default-value",
      ([] as string[]).concat(options.defaultValue).join(",")
    )
  }
  for (const name of ["required", "disabled"] as const) {
    if (options[name]) {
      select.setAttribute(name, "")
    }
  }
  if (options.readOnly) {
    select.setAttribute("read-only", "")
  }
  if (options.defaultOpen) {
    select.setAttribute("default-open", "")
  }
  if (options.modal !== undefined) {
    select.setAttribute("modal", String(options.modal))
  }
  if (options.presentation) {
    select.setAttribute("presentation", options.presentation)
  }
  if (container) {
    select.setAttribute("container", `#${container.id}`)
  }
  if (recent) {
    select.emptyItems = f.recent
  }
  if (fromData) {
    select.items = long
      ? longItems()
      : grouped
        ? [
            {
              type: "group",
              label: f.groups[0].label,
              items: f.groups[0].items,
            },
            { type: "separator" },
            {
              type: "group",
              label: f.groups[1].label,
              items: f.groups[1].items,
            },
          ]
        : f.items
  }
  const output = root.querySelector<HTMLOutputElement>(
    'output[aria-label="Last action"]'
  )!
  select.addEventListener("valuechange", (event) => {
    if (cancel) {
      return event.preventDefault()
    }
    const value = (event as CustomEvent<{ value: unknown }>).detail.value
    output.textContent = `value:${Array.isArray(value) ? value.join(",") : String(value)}`
  })
  const form = root.querySelector("form")!
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    root.querySelector<HTMLOutputElement>(
      'output[aria-label="Submitted"]'
    )!.textContent = serializeForm(form)
  })
  root
    .querySelector("#controller")!
    .addEventListener("click", () => select.api?.open())
  if (!long && !grouped) {
    onItemsChange(changedItems, (entries) => {
      if (fromData) {
        return void (select.items = entries)
      }
      // Moves the items that stay, so they keep their elements, and adds the new
      // ones. The content may be in a portal container, outside the select.
      const list =
        document.querySelector("ui-select-list") ??
        document.querySelector("ui-select-content")!
      const existing = new Map(
        [...list.querySelectorAll<HTMLElement>("ui-select-item")].map((el) => [
          el.getAttribute("value"),
          el,
        ])
      )
      list.replaceChildren(
        ...list.querySelectorAll("ui-select-select-all"),
        ...entries.map(
          (entry) =>
            existing.get(entry.value) ??
            document
              .createRange()
              .createContextualFragment(item(entry.value, entry.label))
        )
      )
    })
  }
  await import("@ui-sdk/web/select")
}

function mount(root: HTMLElement) {
  return render(root)
}

export { mount, render }
