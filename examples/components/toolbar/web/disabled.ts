import "@ui-sdk/web/toolbar"
import { Archive, createElement, Mail, Trash } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-toolbar aria-label="Message">
        <ui-toolbar-button>
          <button data-variant="secondary">
            ${createElement(Mail, { "aria-hidden": "true" }).outerHTML}
            Reply
          </button>
        </ui-toolbar-button>
        <ui-toolbar-button disabled>
          <button data-variant="secondary">
            ${createElement(Archive, { "aria-hidden": "true" }).outerHTML}
            Archive
          </button>
        </ui-toolbar-button>
        <ui-toolbar-button disabled focusable-when-disabled="false">
          <button data-variant="secondary" aria-label="Delete">
            ${createElement(Trash, { "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-toolbar-button>
      </ui-toolbar>
      <ui-toolbar disabled aria-label="Comment">
        <ui-toolbar-input>
          <input aria-label="Comment" value="Read only for now" />
        </ui-toolbar-input>
        <ui-toolbar-button>
          <button data-variant="secondary">Send</button>
        </ui-toolbar-button>
      </ui-toolbar>
    </div>
  `
}

export { mount }
