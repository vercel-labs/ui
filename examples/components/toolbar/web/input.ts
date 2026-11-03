import "@ui-sdk/web/toolbar"
import "@ui-sdk/web/number-input"
import { Bold, createElement, Search } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-toolbar aria-label="Text">
      <ui-toolbar-button>
        <button data-variant="secondary" aria-label="Bold">
          ${createElement(Bold, { "aria-hidden": "true" }).outerHTML}
        </button>
      </ui-toolbar-button>
      <ui-number-input default-value="14" min="8" max="72">
        <ui-toolbar-input>
          <ui-number-input-control>
            <input aria-label="Font size" />
          </ui-number-input-control>
        </ui-toolbar-input>
      </ui-number-input>
      <ui-toolbar-input>
        <input aria-label="Find" placeholder="Find…" />
      </ui-toolbar-input>
      <ui-toolbar-button>
        <button data-variant="secondary" aria-label="Search">
          ${createElement(Search, { "aria-hidden": "true" }).outerHTML}
        </button>
      </ui-toolbar-button>
    </ui-toolbar>
  `
}

export { mount }
