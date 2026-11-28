import { Component } from "@angular/core"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@ui-sdk/angular/hover-card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui-sdk/angular/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ui-sdk/angular/tooltip"
import {
  describeChange,
  hoverPopupsFixture,
} from "../../../../../tests/fixtures/hover-popups"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container
        uiTooltip
        [delay]="0"
        (beforeOpenChange)="opened('tooltip', $event)"
        (beforePayloadChange)="handed('tooltip', $event)"
      >
        @for (day of f.days; track day) {
          <button uiTooltipTrigger [payload]="day.toLowerCase()">
            {{ day }}
          </button>
        }
        <div *uiTooltipContent="let tip" class="tooltip">
          Tip for {{ tip.payload }}
        </div>
      </ng-container>
      <ng-container
        uiHoverCard
        [delay]="0"
        [closeDelay]="0"
        (beforeOpenChange)="opened('hover card', $event)"
        (beforePayloadChange)="handed('hover card', $event)"
      >
        @for (person of f.people; track person) {
          <a
            uiHoverCardTrigger
            [href]="'#' + person"
            [payload]="person.toLowerCase()"
          >
            {{ person }}
          </a>
        }
        <div *uiHoverCardContent="let card" class="hover-card">
          Card for {{ card.payload }}
        </div>
      </ng-container>
      <ng-container
        uiPopover
        openOnHover
        [delay]="0"
        [closeDelay]="0"
        (beforeOpenChange)="opened('popover', $event)"
      >
        <button uiPopoverTrigger>{{ f.popover.trigger }}</button>
        <div *uiPopoverContent class="popup">{{ f.popover.content }}</div>
      </ng-container>
      <output role="status" aria-label="Last change">{{ change() }}</output>
    </div>
  `,
})
class Fixture {
  readonly f = hoverPopupsFixture
  readonly change = state("")

  opened(component: string, change: { value: boolean; event?: Event }) {
    if (change.value) {
      this.change.set(describeChange(component, "open", change.event))
    }
  }

  handed(component: string, change: { value: unknown; event?: Event }) {
    this.change.set(
      describeChange(component, `payload ${change.value}`, change.event)
    )
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
