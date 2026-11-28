import { Component } from "@angular/core"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ui-sdk/angular/tooltip"

@Component({
  imports: [Tooltip, TooltipContent, TooltipTrigger],
  template: `
    <div data-slot="grid">
      @for (item of sides; track item.side) {
        <ng-container uiTooltip>
          <button uiTooltipTrigger>{{ item.label }}</button>
          <div *uiTooltipContent="{ side: item.side }">Add to library</div>
        </ng-container>
      }
    </div>
  `,
})
class Example {
  readonly sides = [
    { side: "top", label: "Top" },
    { side: "left", label: "Left" },
    { side: "right", label: "Right" },
    { side: "bottom", label: "Bottom" },
  ] as const
}

export { Example }
