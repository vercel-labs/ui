import "@ui-sdk/web/popover"
import { Bell, createElement } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-popover>
      <ui-popover-trigger shortcut="mod+u"><button>${createElement(Bell, { "aria-hidden": "true" }).outerHTML}<span data-hide="open">Show updates</span><span data-show="open">Hide updates</span><ui-popover-shortcut></ui-popover-shortcut></button></ui-popover-trigger>
      <ui-popover-content>
        <ui-popover-title as-child><h3>Updates</h3></ui-popover-title>
        <ui-popover-description>Version 2.0 is out.</ui-popover-description>
        <ui-popover-close><a href="https://example.com/changelog">Read the changelog</a></ui-popover-close>
      </ui-popover-content>
    </ui-popover>
  `
}
