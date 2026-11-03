import "@ui-sdk/web/resizable"
import { createElement, Folder, Search } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-resizable>
      <ui-resizable-panel default-size="30" min-size="25" collapsible collapsed-size="56px">
        <span data-slot="row">
          ${createElement(Folder, { "aria-hidden": "true" }).outerHTML}
          <span>Files</span>
        </span>
        <span data-slot="row">
          ${createElement(Search, { "aria-hidden": "true" }).outerHTML}
          <span>Search</span>
        </span>
      </ui-resizable-panel>
      <ui-resizable-handle aria-label="Resize sidebar"><div></div></ui-resizable-handle>
      <ui-resizable-panel>Editor</ui-resizable-panel>
    </ui-resizable>
  `
}

export { mount }
