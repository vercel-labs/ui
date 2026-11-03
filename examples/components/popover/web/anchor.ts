import "@ui-sdk/web/popover"
import { createElement, Settings } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="row">
      <input id="popover-anchor" placeholder="Search" aria-label="Search" />
      <ui-popover>
        <ui-popover-trigger><button aria-label="Search filters">${createElement(Settings, { "aria-hidden": "true" }).outerHTML}</button></ui-popover-trigger>
        <ui-popover-content anchor="#popover-anchor" align="start" side-offset="8">
          <ui-popover-title>Filters</ui-popover-title>
          <ui-popover-description>The popover lines up with the search field.</ui-popover-description>
        </ui-popover-content>
      </ui-popover>
    </div>
  `
}

export { mount }
