import "@ui-sdk/web/toggle"
import { Bold, createElement, Italic } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="row">
      <ui-toggle>
        <button data-variant="outline">
          <ui-toggle-icon>${createElement(Italic, { "aria-hidden": "true" }).outerHTML}</ui-toggle-icon>
          Italic
        </button>
      </ui-toggle>
      <ui-toggle>
        <button data-variant="outline">
          <ui-toggle-icon>${createElement(Bold, { "aria-hidden": "true" }).outerHTML}</ui-toggle-icon>
          Bold
        </button>
      </ui-toggle>
    </div>
  `
}
