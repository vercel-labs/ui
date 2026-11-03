import "@ui-sdk/web/collapsible"
import { ChevronDown, createElement } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-collapsible>
        <ui-collapsible-trigger>
          <button data-variant="secondary">
            Shipping details
            ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-collapsible-trigger>
        <ui-collapsible-panel>
          <p data-slot="hint">Standard shipping. Arrives in 3 to 5 business days.</p>
        </ui-collapsible-panel>
      </ui-collapsible>
      <ui-collapsible disabled>
        <ui-collapsible-trigger>
          <button data-variant="secondary">
            <span>Gift options</span>
            <span data-slot="hint">Not available for this order</span>
            ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-collapsible-trigger>
        <ui-collapsible-panel>
          <p data-slot="hint">Add a gift message and wrapping.</p>
        </ui-collapsible-panel>
      </ui-collapsible>
    </div>
  `
}

export { mount }
