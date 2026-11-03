import "@ui-sdk/web/dialog"
import { createElement, File, Search } from "lucide"

const pages = ["Introduction", "Installation", "Dialog", "Alert Dialog", "Menu"]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-dialog>
      <ui-dialog-trigger shortcut="mod+j">
        <button>
          ${createElement(Search, { "aria-hidden": "true" }).outerHTML}
          Search docs
          <ui-dialog-shortcut></ui-dialog-shortcut>
        </button>
      </ui-dialog-trigger>
      <ui-dialog-backdrop></ui-dialog-backdrop>
      <ui-dialog-content>
        <ui-dialog-title>Search docs</ui-dialog-title>
        <input aria-label="Search" placeholder="Search…" />
        <div data-slot="stack">
          ${pages
            .map(
              (page) =>
                `<ui-dialog-close value="${page}"><button>${createElement(File, { "aria-hidden": "true" }).outerHTML}${page}</button></ui-dialog-close>`,
            )
            .join("")}
        </div>
      </ui-dialog-content>
    </ui-dialog>
  `
}

export { mount }
