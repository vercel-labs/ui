import { Component } from "@angular/core"
import { LucideChevronDown } from "@lucide/angular"
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@ui-sdk/angular/collapsible"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import { Textarea } from "@ui-sdk/angular/textarea"

@Component({
  imports: [
    Collapsible,
    CollapsiblePanel,
    CollapsibleTrigger,
    Field,
    FieldLabel,
    Textarea,
    LucideChevronDown,
  ],
  template: `
    <div uiCollapsible data-variant="card">
      <button uiCollapsibleTrigger>
        <span data-slot="stack">
          <span>Add a delivery note</span>
          <span data-slot="hint">Optional, for the courier</span>
        </span>
        <svg lucideChevronDown></svg>
      </button>
      <div uiCollapsiblePanel keepMounted>
        <div uiField>
          <label uiFieldLabel>Delivery note</label>
          <textarea
            uiTextarea
            placeholder="Leave it with the front desk…"
          ></textarea>
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
