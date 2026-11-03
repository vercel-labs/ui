import "@ui-sdk/web/button"
import { createElement, Trash } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-button>
      <button data-variant="destructive">
        ${createElement(Trash, { "aria-hidden": "true" }).outerHTML}
        Delete
      </button>
    </ui-button>
  `
}
