import { Component } from "@angular/core"
import { LucideFile } from "@lucide/angular"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  type TooltipOpenChange,
} from "@ui-sdk/angular/tooltip"

@Component({
  imports: [Tooltip, TooltipContent, TooltipTrigger, LucideFile],
  template: `
    <ul>
      @for (file of files; track file) {
        <li>
          <ng-container
            uiTooltip
            type="label"
            (beforeOpenChange)="skipIfFits($event, name)"
          >
            <button uiTooltipTrigger>
              <svg lucideFile></svg>
              <span #name>{{ file }}</span>
            </button>
            <div *uiTooltipContent>{{ file }}</div>
          </ng-container>
        </li>
      }
    </ul>
  `,
})
class Example {
  readonly files = [
    "Quarterly report, final revised version for the board.pdf",
    "Notes.txt",
    "Design review recording, October 2nd.mp4",
    "Budget.xlsx",
  ]

  skipIfFits(change: TooltipOpenChange, span: HTMLElement) {
    if (change.value && span.scrollWidth <= span.clientWidth) {
      change.cancel()
    }
  }
}

export { Example }
