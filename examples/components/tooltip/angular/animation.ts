import { Component } from "@angular/core"
import { LucideArchive } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ui-sdk/angular/tooltip"

@Component({
  imports: [Tooltip, TooltipContent, TooltipTrigger, LucideArchive],
  template: `
    <ng-container
      uiTooltip
      (beforeOpenChange)="log($event.value ? 'Opening' : 'Closing')"
      (openChangeComplete)="log($event ? 'Open' : 'Closed')"
    >
      <button uiTooltipTrigger aria-label="Archive">
        <svg lucideArchive></svg>
      </button>
      <div *uiTooltipContent>Archive</div>
    </ng-container>
  `,
})
class Example {
  readonly log = useLog()
}

export { Example }
