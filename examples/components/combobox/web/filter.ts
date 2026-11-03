import "@ui-sdk/web/combobox"
import { Check, ChevronDown, createElement } from "lucide"

const countries = [
  { value: "ar", label: "Argentina" },
  { value: "au", label: "Australia" },
  { value: "at", label: "Austria" },
  { value: "be", label: "Belgium" },
  { value: "br", label: "Brazil" },
  { value: "ca", label: "Canada" },
  { value: "cl", label: "Chile" },
  { value: "dk", label: "Denmark" },
  { value: "fi", label: "Finland" },
  { value: "fr", label: "France" },
  { value: "de", label: "Germany" },
  { value: "gr", label: "Greece" },
  { value: "jp", label: "Japan" },
  { value: "nl", label: "Netherlands" },
  { value: "es", label: "Spain" },
  { value: "se", label: "Sweden" },
  { value: "ch", label: "Switzerland" },
]

function fuzzy(item: { label: string }, query: string) {
  let at = 0
  for (const char of item.label.toLowerCase()) if (char === query[at]?.toLowerCase()) at++
  return at === query.length
}

const filters = [
  { name: "Contains", filter: "contains" },
  { name: "Starts with", filter: "startsWith" },
  { name: "Fuzzy", filter: fuzzy },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <div role="group" aria-label="Filter" data-slot="row">
        ${filters
          .map(
            (option, index) => `
              <button type="button" data-filter="${index}" aria-pressed="${index === 0}">${option.name}</button>
            `,
          )
          .join("")}
      </div>
      <ui-combobox filter="contains">
        <div data-slot="stack">
          <ui-combobox-label>Country</ui-combobox-label>
          <div data-slot="row">
            <ui-combobox-input>
              <input placeholder="Try “an” or “swd”" />
            </ui-combobox-input>
            <ui-combobox-trigger>
              <button aria-label="Show countries">${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}</button>
            </ui-combobox-trigger>
          </div>
        </div>
        <ui-combobox-content>
          <ui-combobox-empty>No countries found.</ui-combobox-empty>
          <ui-combobox-list>
            ${countries
              .map(
                (country) => `
                  <ui-combobox-item value="${country.value}" label="${country.label}">
                    ${country.label}
                    <ui-combobox-item-indicator>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-combobox-item-indicator>
                  </ui-combobox-item>
                `,
              )
              .join("")}
          </ui-combobox-list>
        </ui-combobox-content>
      </ui-combobox>
    </div>
  `
  const combobox = root.querySelector("ui-combobox") as HTMLElement & { filter?: typeof fuzzy }
  const buttons = root.querySelectorAll<HTMLButtonElement>("[data-filter]")
  for (const button of buttons)
    button.addEventListener("click", () => {
      const { filter } = filters[Number(button.dataset.filter)]
      if (typeof filter === "function") combobox.filter = filter
      else {
        combobox.filter = undefined
        combobox.setAttribute("filter", filter)
      }
      for (const other of buttons) other.setAttribute("aria-pressed", String(other === button))
    })
}

export { mount }
