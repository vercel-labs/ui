import { Component } from "@angular/core"
import {
  LucideBold,
  LucideDynamicIcon,
  LucideItalic,
  LucideUnderline,
} from "@lucide/angular"
import {
  createTooltipController,
  Tooltip,
  TooltipContent,
  type TooltipContentState,
  TooltipTrigger,
} from "@ui-sdk/angular/tooltip"

@Component({
  imports: [Tooltip, TooltipContent, TooltipTrigger, LucideDynamicIcon],
  template: `
    <div data-slot="row" role="group" aria-label="Formatting">
      @for (format of formats; track format.label) {
        <button
          uiTooltipTrigger
          [controller]="tooltip"
          [payload]="format.label"
          [attr.aria-label]="format.label"
        >
          <svg [lucideIcon]="format.icon"></svg>
        </button>
      }
      <ng-container uiTooltip [controller]="tooltip">
        <div *uiTooltipContent="let content">{{ content.payload }}</div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly formats = [
    { icon: LucideBold, label: "Bold" },
    { icon: LucideItalic, label: "Italic" },
    { icon: LucideUnderline, label: "Underline" },
  ]

  readonly tooltip = createTooltipController<string>()
}

export { Example }
