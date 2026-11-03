import "@ui-sdk/web/toggle"
import { createElement, Italic } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-toggle>
      <button>
        <ui-toggle-icon>${createElement(Italic, { "aria-hidden": "true" }).outerHTML}</ui-toggle-icon>
        Italic
      </button>
    </ui-toggle>
  `
}

export { mount }
