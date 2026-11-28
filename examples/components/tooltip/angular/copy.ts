import { Component, signal } from "@angular/core"
import { LucideCheck, LucideCopy } from "@lucide/angular"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ui-sdk/angular/tooltip"

@Component({
  imports: [Tooltip, TooltipContent, TooltipTrigger, LucideCheck, LucideCopy],
  template: `
    <div data-slot="row">
      <code>{{ command }}</code>
      <ng-container
        uiTooltip
        [closeOnPress]="false"
        (openChangeComplete)="onOpenChangeComplete($event)"
      >
        <button
          uiTooltipTrigger
          [attr.aria-label]="copied() ? 'Copied' : 'Copy'"
          (click)="copy()"
        >
          @if (copied()) {
            <svg lucideCheck></svg>
          } @else {
            <svg lucideCopy></svg>
          }
        </button>
        <div *uiTooltipContent>{{ copied() ? "Copied" : "Copy" }}</div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly command = "npm install @ui-sdk/angular"

  readonly copied = signal(false)

  onOpenChangeComplete(open: boolean) {
    if (!open) {
      this.copied.set(false)
    }
  }

  copy() {
    navigator.clipboard?.writeText(this.command).catch(() => {})
    this.copied.set(true)
  }
}

export { Example }
