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

const labels = ["Bug", "Feature", "Documentation", "Design", "Performance", "Security", "Testing"]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <form id="combobox-profile" data-slot="stack">
        <ui-combobox name="country" required>
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
        <ui-combobox name="interests" multiple default-value="Design">
          <div data-slot="stack">
            <ui-combobox-label>Interests</ui-combobox-label>
            <ui-combobox-chips>
              <ui-combobox-input>
                <input placeholder="Add interests" />
              </ui-combobox-input>
            </ui-combobox-chips>
          </div>
          <ui-combobox-content>
            <ui-combobox-list>
              ${labels
                .map(
                  (label) => `
                    <ui-combobox-item value="${label}">
                      ${label}
                      <ui-combobox-item-indicator>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-combobox-item-indicator>
                    </ui-combobox-item>
                  `,
                )
                .join("")}
            </ui-combobox-list>
          </ui-combobox-content>
          <template>
            <ui-combobox-chip>
              <ui-combobox-chip-remove><button type="button">×</button></ui-combobox-chip-remove>
            </ui-combobox-chip>
          </template>
        </ui-combobox>
        <div data-slot="row">
          <button type="submit" data-variant="solid">Submit</button>
          <button type="reset">Reset</button>
        </div>
      </form>
      <ui-combobox name="timezone" form="combobox-profile" default-value="Paris">
        <div data-slot="stack">
          <ui-combobox-label>City</ui-combobox-label>
          <div data-slot="row">
            <ui-combobox-input>
              <input />
            </ui-combobox-input>
            <ui-combobox-trigger>
              <button aria-label="Show cities">${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}</button>
            </ui-combobox-trigger>
          </div>
        </div>
        <ui-combobox-content>
          <ui-combobox-list>
            ${["London", "Paris", "Berlin", "Madrid"]
              .map(
                (city) => `
                  <ui-combobox-item value="${city}">
                    ${city}
                    <ui-combobox-item-indicator>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-combobox-item-indicator>
                  </ui-combobox-item>
                `,
              )
              .join("")}
          </ui-combobox-list>
        </ui-combobox-content>
      </ui-combobox>
      <output data-slot="output">Submit the form</output>
    </div>
  `
  const [country, interests] = root.querySelectorAll("ui-combobox") as NodeListOf<
    HTMLElement & { itemToLabel: (value: string) => string }
  >
  country.itemToLabel = countryLabel
  const form = root.querySelector("form")!
  const output = root.querySelector("output")!
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    const data = [...new FormData(form)].map(([name, value]) => `${name}=${value}`)
    output.textContent = data.join("&")
  })
  form.addEventListener("reset", () => (output.textContent = "Submit the form"))
}

export { mount }
