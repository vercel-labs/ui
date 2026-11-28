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
    <div uiCollapsible #parcel="uiCollapsible" data-variant="card">
      <h3>
        <button uiCollapsibleTrigger>
          <span data-slot="stack">
            <span>Track parcel</span>
            <span data-slot="hint">
              {{ parcel.state().open ? "3 updates" : "Arrives Thursday" }}
            </span>
          </span>
          <svg lucideChevronDown></svg>
        </button>
      </h3>
      <ol uiCollapsiblePanel>
        @for (update of updates; track update.label) {
          <li data-slot="row">
            <span>{{ update.label }}</span>
            <span>{{ update.time }}</span>
          </li>
        }
      </ol>
    </div>
  `,
})
class Example {
  readonly updates = [
    { label: "Out for delivery", time: "07:40" },
    { label: "Arrived at the local depot", time: "05:12" },
    { label: "Left the sorting center", time: "Wed 21:03" },
  ]
}

export { Example }
