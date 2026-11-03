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
      <ui-combobox default-value="fr" debug>
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
      <div data-slot="row">
        <button type="button" data-value>Japan</button>
        <button type="button" data-open>Open</button>
      </div>
      <output data-slot="output">Change something</output>
    </div>
  `
  const combobox = root.querySelector("ui-combobox") as HTMLElement & {
    value: string | null
    open: boolean
    itemToLabel: (value: string) => string
  }
  combobox.itemToLabel = countryLabel
  const log = root.querySelector("output")!
  const listen = (type: string, describe: (value: never, reason: string) => string) =>
    combobox.addEventListener(type, (event) => {
      const { value, reason } = (event as CustomEvent<{ value: never; reason: string }>).detail
      log.textContent = describe(value, reason)
    })
  listen("valuechange", (value: string | null, reason) => `value: ${value} (${reason})`)
  listen("querychange", (value: string, reason) => `query: “${value}” (${reason})`)
  listen("openchange", (value: boolean, reason) => `open: ${value} (${reason})`)
  root.querySelector("[data-value]")!.addEventListener("click", () => (combobox.value = "jp"))
  root.querySelector("[data-open]")!.addEventListener("click", () => (combobox.open = true))
}
