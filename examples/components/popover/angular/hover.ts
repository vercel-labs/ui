import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/angular/popover"

@Component({
  imports: [
    Popover,
    PopoverArrow,
    PopoverContent,
    PopoverDescription,
    PopoverTitle,
    PopoverTrigger,
  ],
  template: `
    <ng-container uiPopover openOnHover [delay]="200" [closeDelay]="150">
      <button uiPopoverTrigger>@kofi</button>
      <div *uiPopoverContent="{ sideOffset: 8 }">
        <div uiPopoverArrow></div>
        <h2 uiPopoverTitle>Kofi Mensah</h2>
        <p uiPopoverDescription>Engineering manager, platform team.</p>
        <div data-slot="row">
          <button
            type="button"
            data-size="sm"
            data-variant="solid"
            (click)="log('Followed @kofi')"
          >
            Follow
          </button>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly log = useLog()
}

export { Example }
