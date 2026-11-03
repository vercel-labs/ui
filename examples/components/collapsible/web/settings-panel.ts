import "@ui-sdk/web/collapsible"
import { Settings, createElement } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-collapsible>
      <p>Radius</p>
      <p data-slot="hint">Set the corner radius of the element.</p>
      <div data-slot="row">
        <label data-slot="label">
          <span>Radius</span>
          <input type="number" min="0" value="8">
        </label>
        <ui-collapsible-trigger>
          <button data-variant="secondary">
            ${createElement(Settings, { "aria-hidden": "true" }).outerHTML}
            Edit each axis
          </button>
        </ui-collapsible-trigger>
      </div>
      <ui-collapsible-panel>
        <div data-slot="grid">
          <label data-slot="label">
            <span>Radius X</span>
            <input type="number" min="0" value="8">
          </label>
          <label data-slot="label">
            <span>Radius Y</span>
            <input type="number" min="0" value="8">
          </label>
        </div>
      </ui-collapsible-panel>
    </ui-collapsible>
  `
}

export { mount }
