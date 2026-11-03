import "@ui-sdk/web/toggle"
import { createElement, Pin } from "lucide"

function mount(root: HTMLElement) {
  const hint = `pin-${crypto.randomUUID()}`
  root.innerHTML = `
    <div data-slot="stack">
      <ui-toggle disabled focusable-when-disabled>
        <button aria-describedby="${hint}">
          <ui-toggle-icon>${createElement(Pin, { "aria-hidden": "true" }).outerHTML}</ui-toggle-icon>
          Pin to top
        </button>
      </ui-toggle>
      <p id="${hint}" data-slot="hint">Only owners can pin messages.</p>
    </div>
  `
}

export { mount }
