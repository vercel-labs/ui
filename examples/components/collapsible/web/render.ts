import "@ui-sdk/web/collapsible"
import { ChevronRight, createElement } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-collapsible>
      <h3>
        <ui-collapsible-trigger>
          <button data-variant="secondary">
            ${createElement(ChevronRight, { "aria-hidden": "true" }).outerHTML}
            <span>Track parcel</span>
          </button>
        </ui-collapsible-trigger>
        <span data-slot="hint" data-show="closed">Arrives Thursday</span>
        <span data-slot="hint" data-show="open">3 updates</span>
      </h3>
      <ui-collapsible-panel as-child>
        <ol>
          <li data-slot="row">Out for delivery <span>07:40</span></li>
          <li data-slot="row">Arrived at the local depot <span>05:12</span></li>
          <li data-slot="row">Left the sorting center <span>Wed 21:03</span></li>
        </ol>
      </ui-collapsible-panel>
    </ui-collapsible>
  `
}

export { mount }
