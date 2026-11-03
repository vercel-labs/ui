import "@ui-sdk/web/collapsible"
import { ChevronDown, createElement } from "lucide"

const details = [
  { label: "Shipping address", value: "221B Baker Street, London" },
  { label: "Items", value: "2 × Linen shirt" },
  { label: "Delivery", value: "Standard, arrives March 7" },
  { label: "Total", value: "$84.00" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-collapsible>
      <div data-slot="row">
        <div data-slot="stack">
          <p>Order #4189</p>
          <p data-slot="hint">Placed on March 3</p>
        </div>
        <span data-slot="row">Shipped</span>
      </div>
      <div>
        <ui-collapsible-trigger>
          <button data-variant="secondary">
            Order details
            ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-collapsible-trigger>
        <ui-collapsible-panel>
          <dl>
            ${details
              .map(
                (detail) => `
                  <div data-slot="row">
                    <dt>${detail.label}</dt>
                    <dd>${detail.value}</dd>
                  </div>`,
              )
              .join("")}
          </dl>
        </ui-collapsible-panel>
      </div>
    </ui-collapsible>
  `
}

export { mount }
