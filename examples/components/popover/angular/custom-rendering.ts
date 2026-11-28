import { Component } from "@angular/core"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverShortcut,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/angular/popover"

@Component({
  imports: [
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverDescription,
    PopoverShortcut,
    PopoverTitle,
    PopoverTrigger,
  ],
  template: `
    <ng-container uiPopover>
      <button
        uiPopoverTrigger
        #popoverTrigger="uiPopoverTrigger"
        shortcut="mod+u"
      >
        {{ popoverTrigger.state().open ? "Hide Updates" : "Show Updates" }}
        <kbd uiPopoverShortcut #popoverShortcut="uiPopoverShortcut">{{
          popoverShortcut.state().text
        }}</kbd>
      </button>
      <div *uiPopoverContent>
        <h3 uiPopoverTitle>Updates</h3>
        <p uiPopoverDescription>Version 2.4 adds threaded comments.</p>
        <a uiPopoverClose href="#">Read the Changelog</a>
      </div>
    </ng-container>
  `,
})
class Example {}

export { Example }
