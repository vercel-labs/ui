import { Component } from "@angular/core"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/angular/popover"

@Component({
  imports: [
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverTitle,
    PopoverTrigger,
  ],
  template: `
    <div data-slot="row">
      @for (align of aligns; track align.value) {
        <ng-container uiPopover>
          <button uiPopoverTrigger>{{ align.label }}</button>
          <div *uiPopoverContent="{ align: align.value, sideOffset: 8 }">
            <h2 uiPopoverTitle>Delivery window</h2>
            <p uiPopoverDescription>Arrives Tuesday between 9 AM and noon.</p>
          </div>
        </ng-container>
      }
    </div>
  `,
})
class Example {
  readonly aligns = [
    { value: "start", label: "Start" },
    { value: "center", label: "Center" },
    { value: "end", label: "End" },
  ] as const
}

export { Example }
