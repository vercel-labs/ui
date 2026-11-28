import { Component, signal } from "@angular/core"
import { LucideChevronDown } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
  createCollapsibleController,
} from "@ui-sdk/angular/collapsible"

@Component({
  imports: [
    Collapsible,
    CollapsiblePanel,
    CollapsibleTrigger,
    LucideChevronDown,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="collapsible.toggle()">Toggle</button>
      </div>
      <div
        uiCollapsible
        data-variant="card"
        [(open)]="open"
        [controller]="collapsible"
        (beforeOpenChange)="
          log(($event.value ? 'Opened' : 'Closed') + ' (' + $event.reason + ')')
        "
      >
        <button uiCollapsibleTrigger>
          <span data-slot="stack">
            <span>Recovery codes</span>
            <span data-slot="hint">Each code signs you in once</span>
          </span>
          <svg lucideChevronDown></svg>
        </button>
        <div uiCollapsiblePanel>
          <div data-slot="stack">
            <ul>
              @for (code of recoveryCodes; track code) {
                <li>{{ code }}</li>
              }
            </ul>
            <button type="button" (click)="collapsible.close()">Done</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
class Example {
  readonly recoveryCodes = ["7KQ2-M9XD", "P4TR-8HZC", "W3NB-6JUE", "C5YF-2LSA"]

  readonly log = useLog()

  readonly collapsible = createCollapsibleController()

  readonly open = signal(false)
}

export { Example }
