import "@ui-sdk/web/checkbox"
import { Check, createElement, Minus } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <label data-slot="label">
      <ui-checkbox default-checked="indeterminate">
        <ui-checkbox-indicator>
          ${createElement(Check, { "aria-hidden": "true" }).outerHTML}
          ${createElement(Minus, { "aria-hidden": "true" }).outerHTML}
        </ui-checkbox-indicator>
      </ui-checkbox>
      All notifications
    </label>
  `
}

export { mount }
