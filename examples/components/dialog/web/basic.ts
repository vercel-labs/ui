import "@ui-sdk/web/dialog"
import { createElement, X } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-dialog>
      <ui-dialog-trigger><button>Share</button></ui-dialog-trigger>
      <ui-dialog-backdrop></ui-dialog-backdrop>
      <ui-dialog-content>
        <div data-slot="stack">
          <ui-dialog-title>Share link</ui-dialog-title>
          <ui-dialog-description>Anyone who has this link will be able to view this.</ui-dialog-description>
        </div>
        <label data-slot="label">
          <span data-slot="visually-hidden">Link</span>
          <input value="https://example.com/project" readonly />
        </label>
        <div data-slot="row">
          <ui-dialog-close><button>Close</button></ui-dialog-close>
        </div>
        <ui-dialog-close><button aria-label="Close">${createElement(X, { "aria-hidden": "true" }).outerHTML}</button></ui-dialog-close>
      </ui-dialog-content>
    </ui-dialog>
  `
}

export { mount }
