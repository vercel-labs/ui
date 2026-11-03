import "@ui-sdk/web/tooltip"
import "@ui-sdk/web/popover"
import { Bell, createElement, ExternalLink } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="row">
      <ui-popover>
        <ui-tooltip>
          <ui-tooltip-trigger>
            <ui-popover-trigger><button>${createElement(Bell, { "aria-hidden": "true" }).outerHTML}</button></ui-popover-trigger>
          </ui-tooltip-trigger>
          <ui-tooltip-content>Notifications</ui-tooltip-content>
        </ui-tooltip>
        <ui-popover-content side-offset="8">
          <ui-popover-title>Notifications</ui-popover-title>
          <ui-popover-description>You're all caught up.</ui-popover-description>
        </ui-popover-content>
      </ui-popover>
      <ui-tooltip>
        <ui-tooltip-trigger><a href="https://example.com/changelog" data-variant="link">Changelog${createElement(ExternalLink, { "aria-hidden": "true" }).outerHTML}</a></ui-tooltip-trigger>
        <ui-tooltip-content>What's new in 2.0</ui-tooltip-content>
      </ui-tooltip>
    </div>
  `
}

export { mount }
