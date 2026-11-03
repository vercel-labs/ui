import "@ui-sdk/web/button"
import { createElement, Download } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-button>
      <button aria-label="Download">
        ${createElement(Download, { "aria-hidden": "true" }).outerHTML}
      </button>
    </ui-button>
  `
}
