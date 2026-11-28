import { Component, ElementRef, signal, viewChild } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/angular/checkbox"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  type TooltipOpenChange,
} from "@ui-sdk/angular/tooltip"

@Component({
  imports: [
    Checkbox,
    CheckboxIndicator,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    LucideCheck,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls" #controls>
        <label data-slot="label">
          <button
            uiCheckbox
            [checked]="open()"
            (checkedChange)="open.set($event === true)"
          >
            <span uiCheckboxIndicator>
              <svg lucideCheck></svg>
            </span>
          </button>
          Open
        </label>
      </div>
      <ng-container
        uiTooltip
        [(open)]="open"
        (beforeOpenChange)="onOpenChange($event)"
      >
        <button uiTooltipTrigger>Export</button>
        <div *uiTooltipContent>Download as CSV</div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly log = useLog()

  readonly open = signal(false)

  readonly controls = viewChild<ElementRef<HTMLDivElement>>("controls")

  onOpenChange(change: TooltipOpenChange) {
    const target = change.event?.target
    const inControls =
      target instanceof Node && this.controls()?.nativeElement?.contains(target)
    if (inControls && change.reason !== "escape-key") {
      return change.cancel()
    }
    this.log(`${change.value ? "Opened" : "Closed"} (${change.reason})`)
  }
}

export { Example }
