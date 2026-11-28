import { Component, ElementRef, signal, viewChild } from "@angular/core"
import { LucideCircleQuestionMark } from "@lucide/angular"
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
  type PopoverOpenChange,
} from "@ui-sdk/angular/popover"

const sides = [
  { value: "top", label: "Top" },
  { value: "right", label: "Right" },
  { value: "bottom", label: "Bottom" },
  { value: "left", label: "Left" },
] as const

type Side = (typeof sides)[number]["value"]

@Component({
  imports: [
    Popover,
    PopoverArrow,
    PopoverContent,
    PopoverDescription,
    PopoverTitle,
    PopoverTrigger,
    LucideCircleQuestionMark,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls" role="group" aria-label="Side" #controls>
        @for (option of sides; track option.value) {
          <button
            type="button"
            data-size="sm"
            [attr.aria-pressed]="side() === option.value"
            (click)="side.set(option.value)"
          >
            {{ option.label }}
          </button>
        }
      </div>
      <ng-container
        uiPopover
        [open]="open()"
        (beforeOpenChange)="onOpenChange($event)"
      >
        <button uiPopoverTrigger aria-label="Help">
          <svg lucideCircleQuestionMark></svg>
        </button>
        <div
          *uiPopoverContent="{ side: side(), sideOffset: 10, arrowPadding: 12 }"
        >
          <div uiPopoverArrow></div>
          <h2 uiPopoverTitle>Keyboard shortcuts</h2>
          <p uiPopoverDescription>Press ? anywhere to see them all.</p>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly sides = sides

  readonly open = signal(false)

  readonly side = signal<Side>("bottom")

  readonly controls = viewChild<ElementRef<HTMLDivElement>>("controls")

  onOpenChange(change: PopoverOpenChange) {
    const target = change.event?.target
    const inControls =
      target instanceof Node && this.controls()?.nativeElement?.contains(target)
    if (inControls && change.reason !== "escape-key") {
      return change.cancel()
    }
    this.open.set(change.value)
  }
}

export { Example }
