import { Component } from "@angular/core"
import {
  HoverCard,
  HoverCardArrow,
  HoverCardContent,
  type HoverCardOpenChange,
  HoverCardTrigger,
} from "@ui-sdk/angular/hover-card"
import {
  hoverCardContentOptions,
  hoverCardFixture,
  hoverCardOptions,
} from "../../../../../tests/fixtures/hover-card"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [HoverCard, HoverCardArrow, HoverCardContent, HoverCardTrigger],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container
        uiHoverCard
        [delay]="options.delay"
        [closeDelay]="options.closeDelay"
        [defaultOpen]="options.defaultOpen"
        [container]="options.container"
        (beforeOpenChange)="onOpenChange($event)"
      >
        <a uiHoverCardTrigger [href]="f.href">{{ f.trigger }}</a>
        <div *uiHoverCardContent="content" class="hover-card">
          <div uiHoverCardArrow class="arrow"></div>
          <p>
            <strong>{{ f.name }}</strong>
          </p>
          <p>{{ f.bio }}</p>
          <a [href]="f.linkHref">{{ f.link }}</a>
        </div>
      </ng-container>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  readonly f = hoverCardFixture
  readonly options: {
    delay: number
    closeDelay: number
    defaultOpen?: boolean
    container?: HTMLElement | null
  } = hoverCardOptions()
  readonly content = hoverCardContentOptions()
  readonly action = state("")

  onOpenChange({ value, reason }: HoverCardOpenChange) {
    this.action.set(`${value ? "open" : "close"}: ${reason}`)
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
