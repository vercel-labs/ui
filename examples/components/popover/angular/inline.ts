import { Component } from "@angular/core"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/angular/popover"

@Component({
  imports: [
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverDescription,
    PopoverTitle,
    PopoverTrigger,
  ],
  template: `
    <div data-slot="popover-frame">
      <div data-slot="popover-corner">
        <ng-container uiPopover>
          <button uiPopoverTrigger>Feedback</button>
          <div *uiPopoverContent="{ inline: true }">
            <h2 uiPopoverTitle>Send feedback</h2>
            <p uiPopoverDescription>
              The panel sits in the corner box, above its trigger.
            </p>
            <div data-slot="row">
              <button uiPopoverClose>Close</button>
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
