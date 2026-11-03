import "@ui-sdk/web/collapsible"
import { ChevronDown, createElement } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-collapsible>
      <ui-collapsible-trigger>
        <button data-variant="secondary">
          Add a delivery note
          ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
        </button>
      </ui-collapsible-trigger>
      <ui-collapsible-panel keep-mounted>
        <label data-slot="label">
          <span>Delivery note</span>
          <textarea placeholder="Leave it with the front desk…"></textarea>
        </label>
      </ui-collapsible-panel>
    </ui-collapsible>
  `
}

export { mount }
