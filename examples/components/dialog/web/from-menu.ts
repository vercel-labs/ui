import "@ui-sdk/web/menu"
import "@ui-sdk/web/dialog"
import { Copy, createElement, Ellipsis, Pencil } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-menu>
      <ui-menu-trigger><button aria-label="File actions">${createElement(Ellipsis, { "aria-hidden": "true" }).outerHTML}</button></ui-menu-trigger>
      <ui-menu-content>
        <ui-menu-item value="rename">${createElement(Pencil, { "aria-hidden": "true" }).outerHTML}Rename…</ui-menu-item>
        <ui-menu-item value="duplicate">${createElement(Copy, { "aria-hidden": "true" }).outerHTML}Duplicate</ui-menu-item>
      </ui-menu-content>
    </ui-menu>
    <ui-dialog>
      <ui-dialog-backdrop></ui-dialog-backdrop>
      <ui-dialog-content>
        <div data-slot="stack">
          <ui-dialog-title>Rename file</ui-dialog-title>
          <ui-dialog-description>Names must be unique in a folder.</ui-dialog-description>
        </div>
        <label data-slot="label">
          Name
          <input value="report.pdf" />
        </label>
        <div data-slot="row">
          <ui-dialog-close><button>Cancel</button></ui-dialog-close>
          <ui-dialog-close value="rename"><button data-variant="solid">Rename</button></ui-dialog-close>
        </div>
      </ui-dialog-content>
    </ui-dialog>
  `
  const dialog = root.querySelector("ui-dialog")!
  root.querySelector("ui-menu")!.addEventListener("action", (event) => {
    if ((event as CustomEvent<{ value: string }>).detail.value === "rename") dialog.api.open()
  })
}

export { mount }
