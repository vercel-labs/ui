import "@ui-sdk/web/combobox"
import "@ui-sdk/web/field"
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

function mount(root: HTMLElement) {
  root.innerHTML = `
    <form data-slot="stack">
      <ui-field name="country">
        <ui-field-label>Country</ui-field-label>
        <ui-combobox required>
          <div data-slot="row">
            <ui-combobox-input>
              <input placeholder="Search countries" />
            </ui-combobox-input>
            <ui-combobox-trigger>
              <button aria-label="Show countries">${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}</button>
            </ui-combobox-trigger>
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
        <ui-field-description>Where we ship your order.</ui-field-description>
        <div><ui-field-error match="valueMissing">Choose a country.</ui-field-error></div>
      </ui-field>
      <button type="submit" data-variant="solid">
        Continue
      </button>
      <output data-slot="output"></output>
    </form>
  `
  const form = root.querySelector("form")!
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    root.querySelector("output")!.textContent = `Shipping to ${new FormData(form).get("country")}.`
  })
}

export { mount }
