import { Component } from "@angular/core"
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@ui-sdk/angular/collapsible"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [Collapsible, CollapsiblePanel, CollapsibleTrigger],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div
        uiCollapsible
        #collapsible="uiCollapsible"
        class="collapsible"
        [class.is-open]="collapsible.state().open"
        [class.is-closed]="!collapsible.state().open"
        (openChange)="action.set($event ? 'open' : 'closed')"
      >
        <div
          uiCollapsibleTrigger
          #trigger="uiCollapsibleTrigger"
          class="collapsible-trigger"
        >
          Files<span aria-hidden="true">
            {{ trigger.state().open ? "−" : "+" }}</span
          >
        </div>
        <section *uiCollapsiblePanel class="collapsible-panel">
          The files panel.
        </section>
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  readonly action = state("")
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
