import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
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
    <ng-container
      uiPopover
      (beforeOpenChange)="log($event.value ? 'Opening' : 'Closing')"
      (openChangeComplete)="log($event ? 'Open' : 'Closed')"
    >
      <button uiPopoverTrigger>What's New</button>
      <div *uiPopoverContent="{ keepMounted: true }">
        <h2 uiPopoverTitle>What's new</h2>
        <p uiPopoverDescription>Comments now support threads and reactions.</p>
        <div data-slot="row">
          <button uiPopoverClose data-variant="solid">Got It</button>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly log = useLog()
}

export { Example }
