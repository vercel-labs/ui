import "@ui-sdk/web/checkbox"
import { Check, createElement } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <label data-slot="label">
        <ui-checkbox default-checked disabled>
          <ui-checkbox-indicator>
            ${createElement(Check, { "aria-hidden": "true" }).outerHTML}
          </ui-checkbox-indicator>
        </ui-checkbox>
        Security alerts
      </label>
      <label data-slot="label">
        <ui-checkbox disabled>
          <ui-checkbox-indicator>
            ${createElement(Check, { "aria-hidden": "true" }).outerHTML}
          </ui-checkbox-indicator>
        </ui-checkbox>
        Enable notifications
      </label>
    </div>
  `
}

export { mount }
