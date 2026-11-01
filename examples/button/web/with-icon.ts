import "@ui-sdk/web/button"
import { ChevronRight, createElement, Plus } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="row">
      <ui-button>
        <button>
          ${createElement(Plus, { class: "size-4", "aria-hidden": "true" }).outerHTML}
          New project
        </button>
      </ui-button>
      <ui-button>
        <button>
          Continue
          ${createElement(ChevronRight, { class: "size-4 rtl:rotate-180", "aria-hidden": "true" }).outerHTML}
        </button>
      </ui-button>
    </div>
  `
}
