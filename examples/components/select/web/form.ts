import "@ui-sdk/web/select"
import { Check, ChevronDown, createElement } from "lucide"

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
]

const countries = [
  { value: "ar", label: "Argentina", code: "+54" },
  { value: "au", label: "Australia", code: "+61" },
  { value: "at", label: "Austria", code: "+43" },
  { value: "be", label: "Belgium", code: "+32" },
  { value: "br", label: "Brazil", code: "+55" },
  { value: "ca", label: "Canada", code: "+1" },
  { value: "cl", label: "Chile", code: "+56" },
  { value: "cn", label: "China", code: "+86" },
  { value: "dk", label: "Denmark", code: "+45" },
  { value: "fi", label: "Finland", code: "+358" },
  { value: "fr", label: "France", code: "+33" },
  { value: "de", label: "Germany", code: "+49" },
  { value: "gr", label: "Greece", code: "+30" },
  { value: "in", label: "India", code: "+91" },
  { value: "ie", label: "Ireland", code: "+353" },
  { value: "it", label: "Italy", code: "+39" },
  { value: "jp", label: "Japan", code: "+81" },
  { value: "mx", label: "Mexico", code: "+52" },
  { value: "nl", label: "Netherlands", code: "+31" },
  { value: "no", label: "Norway", code: "+47" },
  { value: "pt", label: "Portugal", code: "+351" },
  { value: "es", label: "Spain", code: "+34" },
  { value: "se", label: "Sweden", code: "+46" },
  { value: "ch", label: "Switzerland", code: "+41" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <form id="select-order" data-slot="stack">
        <ui-select name="country" auto-complete="country" required placeholder="Select a country">
          <div data-slot="stack">
            <ui-select-label>Country</ui-select-label>
            <ui-select-trigger>
              <button>
                <ui-select-value></ui-select-value>
                ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
              </button>
            </ui-select-trigger>
          </div>
          <ui-select-content>
            ${countries
              .map(
                (country) => `
                  <ui-select-item value="${country.value}">
                    ${country.label}
                    <ui-select-item-indicator>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-select-item-indicator>
                  </ui-select-item>
                `,
              )
              .join("")}
          </ui-select-content>
        </ui-select>
        <ui-select name="fruit" multiple default-value="apple">
          <div data-slot="stack">
            <ui-select-label>Fruits</ui-select-label>
            <ui-select-trigger>
              <button>
                <ui-select-value></ui-select-value>
                ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
              </button>
            </ui-select-trigger>
          </div>
          <ui-select-content>
            ${fruits
              .map(
                (fruit) => `
                  <ui-select-item value="${fruit.value}">
                    ${fruit.label}
                    <ui-select-item-indicator>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-select-item-indicator>
                  </ui-select-item>
                `,
              )
              .join("")}
          </ui-select-content>
        </ui-select>
        <div data-slot="row">
          <button type="submit">
            Submit
          </button>
          <button type="reset">
            Reset
          </button>
        </div>
      </form>
      <ui-select name="size" form="select-order" default-value="Medium">
        <div data-slot="stack">
          <ui-select-label>Size</ui-select-label>
          <ui-select-trigger>
            <button>
              <ui-select-value></ui-select-value>
              ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
            </button>
          </ui-select-trigger>
        </div>
        <ui-select-content>
          ${["Small", "Medium", "Large"]
            .map(
              (size) => `
                <ui-select-item value="${size}">
                  ${size}
                  <ui-select-item-indicator>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-select-item-indicator>
                </ui-select-item>
              `,
            )
            .join("")}
        </ui-select-content>
      </ui-select>
      <output data-slot="output">Submit the form</output>
    </div>
  `
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
