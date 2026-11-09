import { onItemsChange } from "tests/fixtures/items.ts"
import {
  changedToppings,
  listboxAction,
  listboxData,
  listboxFixture as f,
  listboxOptions,
  longToppings,
} from "tests/fixtures/listbox.ts"
import { serializeForm } from "tests/fixtures/select.ts"

const item = (value: string, label: string, disabled?: boolean) =>
  `<ui-listbox-item class="item" value="${value}"${disabled ? " disabled" : ""}><ui-listbox-item-icon class="icon"></ui-listbox-item-icon>${label}<ui-listbox-item-indicator class="indicator">✓</ui-listbox-item-indicator></ui-listbox-item>`

// The parts a data listbox copies for what it renders.
const template = `
  <template>
    <ui-listbox-item class="item"><ui-listbox-item-indicator class="indicator">✓</ui-listbox-item-indicator></ui-listbox-item>
    <ui-listbox-group class="group"></ui-listbox-group>
    <ui-listbox-group-label class="label"></ui-listbox-group-label>
    <ui-listbox-separator class="separator"></ui-listbox-separator>
  </template>`

async function render(root: HTMLElement, data = false) {
  const {
    fieldset,
    grouped,
    cancel,
    long,
    controlled,
    defaultValue,
    ...options
  } = listboxOptions()
  void controlled
  const list = long
    ? longToppings()
        .map((entry) => item(entry.value, entry.label))
        .join("")
    : grouped
      ? f.groups
          .map(
            (group, index) =>
              `${index ? '<ui-listbox-separator class="separator"></ui-listbox-separator>' : ""}<ui-listbox-group class="group"><ui-listbox-group-label class="label">${group.label}</ui-listbox-group-label>${group.items.map((entry) => item(entry.value, entry.label)).join("")}</ui-listbox-group>`
          )
          .join("")
      : f.items
          .map((entry) => item(entry.value, entry.label, entry.disabled))
          .join("")
  const control = `<ui-listbox class="listbox" aria-label="${f.label}" name="${f.name}">${data ? template : list}</ui-listbox>`
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
      <output role="status" aria-label="Reason"></output>
      <output role="status" aria-label="Submitted"></output>
      <button id="clear">${f.clear}</button>
      <button id="select-all">${f.selectAll}</button>
    </div>`
  const listbox = root.querySelector<HTMLElement & Record<string, any>>(
    "ui-listbox"
  )!
  for (const name of [
    "multiple",
    "deselectable",
    "required",
    "disabled",
  ] as const) {
    if (options[name]) {
      listbox.setAttribute(name, "")
    }
  }
  if (options.readOnly) {
    listbox.setAttribute("read-only", "")
  }
  if (options.activation) {
    listbox.setAttribute("activation", options.activation)
  }
  if (options.orientation === "horizontal") {
    listbox.setAttribute("orientation", "horizontal")
  }
  if (!options.loop) {
    listbox.setAttribute("loop", "false")
  }
  if (defaultValue !== undefined) {
    listbox.setAttribute(
      "default-value",
      ([] as string[]).concat(defaultValue).join(",")
    )
  }
  if (data) {
    listbox.items = long ? longToppings() : listboxData(grouped)
  }
  const output = (name: string) =>
    root.querySelector<HTMLOutputElement>(`output[aria-label="${name}"]`)!
  listbox.addEventListener("valuechange", (event) => {
    const detail = (event as CustomEvent<{ value: unknown; reason: string }>)
      .detail
    output("Reason").textContent = detail.reason
    if (cancel) {
      return event.preventDefault()
    }
    output("Last action").textContent = listboxAction(detail.value)
  })
  const form = root.querySelector("form")!
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    output("Submitted").textContent = serializeForm(form)
  })
  root
    .querySelector("#clear")!
    .addEventListener("click", () => listbox.api?.clear())
  root
    .querySelector("#select-all")!
    .addEventListener("click", () => listbox.api?.selectAll())
  // Every item element by value, kept while the spec's changes take them out.
  const elements = new Map(
    [...listbox.querySelectorAll<HTMLElement>("ui-listbox-item")].map((el) => [
      el.getAttribute("value"),
      el,
    ])
  )
  onItemsChange(changedToppings, (entries) => {
    if (data) {
      return void (listbox.items = entries)
    }
    // Moves the items that stay, so they keep their elements, and brings back ones that left.
    listbox.replaceChildren(
      ...entries.map((entry) => elements.get(entry.value)!)
    )
  })
  await import("@ui-sdk/web/listbox")
}

function mount(root: HTMLElement) {
  return render(root)
}

export { mount, render }
