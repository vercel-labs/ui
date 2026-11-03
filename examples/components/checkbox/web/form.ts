import "@ui-sdk/web/checkbox"
import { Check, createElement } from "lucide"

const formId = "checkbox-signup"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <form data-slot="stack" id="${formId}">
        <label data-slot="label">
          <ui-checkbox name="terms" value="yes" required>
            <ui-checkbox-indicator>
              ${createElement(Check, { "aria-hidden": "true" }).outerHTML}
            </ui-checkbox-indicator>
          </ui-checkbox>
          I agree to the terms
        </label>
        <div data-slot="row">
          <button type="submit">
            Submit
          </button>
          <button type="reset">
            Reset
          </button>
        </div>
      </form>
      <label data-slot="label">
        <ui-checkbox form="${formId}" name="newsletter" value="weekly" default-checked>
          <ui-checkbox-indicator>
            ${createElement(Check, { "aria-hidden": "true" }).outerHTML}
          </ui-checkbox-indicator>
        </ui-checkbox>
        Send me the weekly newsletter
      </label>
      <output data-slot="output"></output>
    </div>
  `
  const form = root.querySelector("form")!
  const result = root.querySelector("output")!
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    const entries = [...new FormData(form)].map(([name, value]) => `${name}=${value}`)
    result.textContent = `Submitted: ${entries.join(", ") || "nothing"}`
  })
  form.addEventListener("reset", () => (result.textContent = ""))
}

export { mount }
