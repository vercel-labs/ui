import { Component } from "@angular/core"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ui-sdk/angular/tooltip"
import { mountAngular } from "../../angular-mount"

@Component({
  imports: [Tooltip, TooltipContent, TooltipTrigger],
  template: `
    <div class="fixture tooltip-page">
      <button>Before</button>
      <ng-container uiTooltip [delay]="100">
        <a uiTooltipTrigger href="#docs">Docs</a>
        <div *uiTooltipContent class="tooltip">Read the docs</div>
      </ng-container>
      <ng-container uiTooltip [delay]="100">
        <button
          uiTooltipTrigger
          #trigger="uiTooltipTrigger"
          [class]="trigger.state().open ? 'is-open' : 'is-closed'"
        >
          Status
          <span aria-hidden="true">{{ trigger.state().open ? "●" : "○" }}</span>
        </button>
        <div
          *uiTooltipContent="let tip"
          class="tooltip"
          [class.is-open]="tip.open"
        >
          All systems normal
        </div>
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
