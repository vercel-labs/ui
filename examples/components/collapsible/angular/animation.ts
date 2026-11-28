import { Component } from "@angular/core"
import { LucideChevronDown } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
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
    <div
      uiCollapsible
      data-variant="card"
      (openChangeComplete)="
        log($event ? 'Finished opening' : 'Finished closing')
      "
    >
      <button uiCollapsibleTrigger>
        <span data-slot="stack">
          <span>Release notes</span>
          <span data-slot="hint">Version 2.4, released October 28</span>
        </span>
        <svg lucideChevronDown></svg>
      </button>
      <div uiCollapsiblePanel>
        <ul>
          @for (note of notes; track note) {
            <li>{{ note }}</li>
          }
        </ul>
      </div>
    </div>
  `,
})
class Example {
  readonly notes = [
    "Search now matches file contents, not only names.",
    "Shared links remember the folder they were opened from.",
    "Uploads resume after the connection drops.",
  ]

  readonly log = useLog()
}

export { Example }
