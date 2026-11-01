import "@ui-sdk/web/button"
import { ArrowUp, createElement } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="row">
      <ui-button>
        <button data-shape="round">Subscribe</button>
      </ui-button>
      <ui-button>
        <button data-shape="round" aria-label="Scroll to top">
          ${createElement(ArrowUp, { class: "size-4", "aria-hidden": "true" }).outerHTML}
        </button>
      </ui-button>
    </div>
  `
}
