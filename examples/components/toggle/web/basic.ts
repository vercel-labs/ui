import "@ui-sdk/web/toggle"
import { Bookmark, createElement } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-toggle>
      <button aria-label="Bookmark">
        <ui-toggle-icon data-variant="fill">${createElement(Bookmark, { "aria-hidden": "true" }).outerHTML}</ui-toggle-icon>
      </button>
    </ui-toggle>
  `
}

export { mount }
