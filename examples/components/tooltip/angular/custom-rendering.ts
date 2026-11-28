import { Component } from "@angular/core"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ui-sdk/angular/tooltip"

@Component({
  imports: [Tooltip, TooltipContent, TooltipTrigger],
  template: `
    <ng-container uiTooltip>
      <a
        uiTooltipTrigger
        data-variant="link"
        href="https://example.com/changelog"
        >Changelog</a
      >
      <div *uiTooltipContent>See what's new in 2.0</div>
    </ng-container>
  `,
})
class Example {}

export { Example }
