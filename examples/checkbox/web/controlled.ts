import "@ui-sdk/web/checkbox"
import { Check, createElement } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <label data-slot="label">
        <ui-checkbox>
          <ui-checkbox-indicator>
            ${createElement(Check, { "aria-hidden": "true" }).outerHTML}
          </ui-checkbox-indicator>
        </ui-checkbox>
        Email me about product updates
      </label>
      <button type="button">
        Toggle from outside
      </button>
      <output data-slot="output">Checked: false</output>
    </div>
  `
  const control = root.querySelector("ui-checkbox")!
  root.querySelector("button")!.addEventListener("click", () => control.api.toggle())

  control.addEventListener("checkedchange", (event) => {
    const { value, reason } = (event as CustomEvent<{ value: boolean | "indeterminate"; reason: string }>)
      .detail
    root.querySelector("output")!.textContent = `Checked: ${value}, last change: ${reason}`
  })
}

export { mount }
