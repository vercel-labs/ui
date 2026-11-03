import "@ui-sdk/web/collapsible"
import { ChevronDown, createElement } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-collapsible>
        <ui-collapsible-trigger>
          <button data-variant="secondary">
            Ingredients
            ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-collapsible-trigger>
        <ui-collapsible-panel hidden-until-found>
          <p data-slot="hint">Flour, butter, brown sugar, eggs, a pinch of cardamom and sea salt.</p>
        </ui-collapsible-panel>
      </ui-collapsible>
    </div>
  `
}

export { mount }
