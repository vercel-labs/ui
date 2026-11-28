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
          <span>Ingredients</span>
          <span data-slot="hint">Morning buns, makes 12</span>
        </span>
        <svg lucideChevronDown></svg>
      </button>
      <div uiCollapsiblePanel hiddenUntilFound>
        <p>
          Flour, butter, brown sugar, eggs, a pinch of cardamom and sea salt.
        </p>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
