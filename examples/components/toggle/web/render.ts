import "@ui-sdk/web/toggle"
import { createElement, Heart } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-toggle default-pressed>
      <button aria-label="Favorite">
        <ui-toggle-icon data-variant="fill">${createElement(Heart, { "aria-hidden": "true" }).outerHTML}</ui-toggle-icon>
      </button>
    </ui-toggle>
  `
}

export { mount }
