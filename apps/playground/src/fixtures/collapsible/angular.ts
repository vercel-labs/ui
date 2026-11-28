import { NgTemplateOutlet } from "@angular/common"
import { Component } from "@angular/core"
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
  type CollapsibleOpenChange,
} from "@ui-sdk/angular/collapsible"
import { createCollapsibleController } from "@ui-sdk/core/collapsible"
import { collapsibleFixture } from "../../../../../tests/fixtures/collapsible"
import { collapsibleOptions } from "../../../../../tests/fixtures/page"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    Collapsible,
    CollapsiblePanel,
    CollapsibleTrigger,
    NgTemplateOutlet,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div
        uiCollapsible
        class="collapsible"
        [defaultOpen]="options.defaultOpen"
        [disabled]="options.disabled"
        [controller]="controller"
        (beforeOpenChange)="onOpenChange($event)"
        (openChangeComplete)="complete.set($event ? 'open' : 'closed')"
      >
        <button uiCollapsibleTrigger class="collapsible-trigger">
          {{ fixture.trigger }}
        </button>
        @if (options.keepMounted || options.hiddenUntilFound) {
          <div
            uiCollapsiblePanel
            class="collapsible-panel"
            [keepMounted]="options.keepMounted"
            [hiddenUntilFound]="options.hiddenUntilFound"
          >
            <ng-container [ngTemplateOutlet]="content" />
          </div>
        } @else {
          <div *uiCollapsiblePanel class="collapsible-panel">
            <ng-container [ngTemplateOutlet]="content" />
          </div>
        }
        <ng-template #content>
          <p>{{ fixture.content }}</p>
          <label>{{ fixture.field }} <input /></label>
          <button (click)="controller.close()">{{ fixture.close }}</button>
        </ng-template>
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output aria-label="Last reason">{{ reason() }}</output>
      <output aria-label="Last source">{{ source() }}</output>
      <output aria-label="Last completed">{{ complete() }}</output>
      <button (click)="controller.toggle()">{{ fixture.controller }}</button>
    </div>
  `,
})
class Fixture {
  readonly controller = createCollapsibleController()
  readonly options = collapsibleOptions()
  readonly fixture = collapsibleFixture
  readonly action = state("")
  readonly reason = state("")
  readonly source = state("")
  readonly complete = state("")

  onOpenChange(change: CollapsibleOpenChange) {
    if (this.options.cancel === (change.value ? "open" : "close")) {
      return change.cancel()
    }
    this.action.set(change.value ? "open" : "closed")
    this.reason.set(change.reason)
    this.source.set(change.source)
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
