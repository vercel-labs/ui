import { Component } from "@angular/core"
import { LucideInfo } from "@lucide/angular"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ui-sdk/angular/tooltip"

@Component({
  imports: [Tooltip, TooltipContent, TooltipTrigger, LucideInfo],
  template: `
    <div data-slot="row">
      <span data-slot="label">Storage</span>
      <ng-container uiTooltip toggleable>
        <button uiTooltipTrigger aria-label="About storage" data-size="sm">
          <svg lucideInfo></svg>
        </button>
        <div *uiTooltipContent>Files in the trash still use storage.</div>
      </ng-container>
      <span data-slot="hint">12.4 of 15 GB used</span>
    </div>
  `,
})
class Example {}

export { Example }
