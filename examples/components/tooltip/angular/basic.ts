import { Component } from "@angular/core"
import { LucideBookmark } from "@lucide/angular"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ui-sdk/angular/tooltip"

@Component({
  imports: [Tooltip, TooltipContent, TooltipTrigger, LucideBookmark],
  template: `
    <ng-container uiTooltip defaultOpen>
      <button uiTooltipTrigger aria-label="Add to library">
        <svg lucideBookmark></svg>
      </button>
      <div *uiTooltipContent>Add to library</div>
    </ng-container>
  `,
})
class Example {}

export { Example }
