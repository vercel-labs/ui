import "@ui-sdk/web/toolbar"
import { Copy, createElement, Download, Redo, Undo } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-toolbar aria-label="Editor">
      <ui-toolbar-group aria-label="Clipboard">
        <ui-toolbar-button>
          <button data-variant="secondary" aria-label="Copy">
            ${createElement(Copy, { "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-toolbar-button>
        <ui-toolbar-button>
          <button data-variant="secondary" aria-label="Download">
            ${createElement(Download, { "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-toolbar-button>
      </ui-toolbar-group>
      <ui-toolbar-separator></ui-toolbar-separator>
      <ui-toolbar-group disabled aria-label="History">
        <ui-toolbar-button>
          <button data-variant="secondary" aria-label="Undo">
            ${createElement(Undo, { "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-toolbar-button>
        <ui-toolbar-button>
          <button data-variant="secondary" aria-label="Redo">
            ${createElement(Redo, { "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-toolbar-button>
      </ui-toolbar-group>
    </ui-toolbar>
  `
}

export { mount }
