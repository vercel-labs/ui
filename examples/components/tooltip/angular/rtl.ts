import { Component } from "@angular/core"
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@ui-sdk/angular/tooltip"

@Component({
  imports: [Tooltip, TooltipArrow, TooltipContent, TooltipTrigger],
  template: `
    <div dir="rtl" data-slot="row">
      @for (item of sides; track item.side) {
        <ng-container uiTooltip>
          <button uiTooltipTrigger>{{ item.label }}</button>
          <div
            *uiTooltipContent="{
              side: item.side,
              align: 'start',
              sideOffset: 8,
            }"
          >
            <div uiTooltipArrow></div>
            أضف إلى المكتبة
          </div>
        </ng-container>
      }
    </div>
  `,
})
class Example {
  readonly sides = [
    { side: "right", label: "يمين" },
    { side: "top", label: "أعلى" },
    { side: "bottom", label: "أسفل" },
    { side: "left", label: "يسار" },
  ] as const
}

export { Example }
