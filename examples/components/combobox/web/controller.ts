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

const countryLabel = (value: string) => countries.find((country) => country.value === value)?.label ?? value

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-combobox>
        <div data-slot="stack">
          <ui-combobox-label>Country</ui-combobox-label>
          <div data-slot="row">
            <ui-combobox-input>
              <input placeholder="Search countries" />
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
                (item) => `
                  <ui-combobox-item value="${item.value}" label="${item.label}">
                    ${item.label}
                    <ui-combobox-item-indicator>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-combobox-item-indicator>
                  </ui-combobox-item>
                `,
              )
              .join("")}
          </ui-combobox-list>
        </ui-combobox-content>
      </ui-combobox>
      <div data-slot="row">
        <button type="button" data-action="open">Open</button>
        <button type="button" data-action="search">Search “sw”</button>
        <button type="button" data-action="germany">Germany</button>
        <button type="button" data-action="clear">Clear</button>
      </div>
      <output data-slot="output">Use the buttons</output>
    </div>
  `
  const combobox = root.querySelector("ui-combobox") as HTMLElement & {
    itemToLabel: (value: string) => string
    api: {
      open: () => Promise<{ reason: string }>
      getValue: () => string | null
      setValue: (value: string | null) => void
      setQuery: (query: string) => void
      clear: () => void
      focus: () => void
    }
  }
  combobox.itemToLabel = countryLabel
  const country = combobox.api
  const log = root.querySelector("output")!
  const actions: Record<string, () => void> = {
    open: async () => {
      const { reason } = await country.open()
      log.textContent = `Closed by ${reason}, with ${country.getValue() ?? "nothing"}`
    },
    search: () => {
      country.focus()
      country.setQuery("sw")
      country.open()
    },
    germany: () => country.setValue("de"),
    clear: () => country.clear(),
  }
  for (const button of root.querySelectorAll<HTMLElement>("[data-action]"))
    button.addEventListener("click", () => actions[button.dataset.action!]())
}
