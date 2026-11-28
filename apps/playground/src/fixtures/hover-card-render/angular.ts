import { Component } from "@angular/core"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@ui-sdk/angular/hover-card"
import { mountAngular } from "../../angular-mount"

@Component({
  imports: [HoverCard, HoverCardContent, HoverCardTrigger],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container uiHoverCard [delay]="100" [closeDelay]="100">
        <a
          uiHoverCardTrigger
          #trigger="uiHoverCardTrigger"
          href="#repo"
          [class]="trigger.state().open ? 'is-open' : 'is-closed'"
        >
          ui-sdk
          <span aria-hidden="true">{{ trigger.state().open ? "▲" : "▼" }}</span>
        </a>
        <section *uiHoverCardContent class="hover-card" aria-label="Repository">
          A headless UI kit.
        </section>
      </ng-container>
      <button>After</button>
    </div>
  `,
})
class Fixture {}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
