import "@ui-sdk/web/tooltip"
import { createElement, Info } from "lucide"

function mount(root: HTMLElement) {
  const id = `tooltip-anchor-${crypto.randomUUID()}`
  root.innerHTML = `
    <div data-slot="stack">
      <label data-slot="label" for="${id}-url">Webhook URL</label>
      <div data-slot="row" id="${id}-field">
        <input id="${id}-url" placeholder="https://" />
        <ui-tooltip>
          <ui-tooltip-trigger><button aria-label="About webhooks">${createElement(Info, { "aria-hidden": "true" }).outerHTML}</button></ui-tooltip-trigger>
          <ui-tooltip-content anchor="#${id}-field" align="start">We send a POST request to this URL for every new order.</ui-tooltip-content>
        </ui-tooltip>
      </div>
    </div>
  `
}

export { mount }
