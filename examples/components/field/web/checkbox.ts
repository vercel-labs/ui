import "@ui-sdk/web/checkbox"
import "@ui-sdk/web/field"
import { Check, createElement } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-field>
      <ui-checkbox name="usage">
        <ui-checkbox-indicator>
          ${createElement(Check, { "aria-hidden": "true" }).outerHTML}
        </ui-checkbox-indicator>
      </ui-checkbox>
      <div data-slot="stack">
        <ui-field-label>Share usage data</ui-field-label>
        <ui-field-description>
          Help us improve by sending anonymous crash reports and usage statistics.
        </ui-field-description>
      </div>
    </ui-field>
  `
}
