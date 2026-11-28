import { Component } from "@angular/core"
import { LucideChevronDown } from "@lucide/angular"
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@ui-sdk/angular/collapsible"

@Component({
  imports: [
    Collapsible,
    CollapsiblePanel,
    CollapsibleTrigger,
    LucideChevronDown,
  ],
  template: `
    <div uiCollapsible data-variant="card">
      <button uiCollapsibleTrigger>
        <span data-slot="stack">
          <span>Order #4189</span>
          <span data-slot="hint">3 items, $84.00</span>
        </span>
        <svg lucideChevronDown></svg>
      </button>
      <div uiCollapsiblePanel>
        @for (item of items; track item.name) {
          <div data-slot="row">
            <span>{{ item.name }}</span>
            <span>{{ item.price }}</span>
          </div>
        }
      </div>
    </div>
  `,
})
class Example {
  readonly items = [
    { name: "Linen shirt", price: "$48.00" },
    { name: "Canvas tote", price: "$18.00" },
    { name: "Wool socks", price: "$18.00" },
  ]
}

export { Example }
