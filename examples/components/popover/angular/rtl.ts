import { Component } from "@angular/core"
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
    <div dir="rtl">
      <ng-container uiPopover>
        <button uiPopoverTrigger>الأبعاد</button>
        <div *uiPopoverContent="{ align: 'start', sideOffset: 8 }">
          <div uiPopoverArrow></div>
          <h2 uiPopoverTitle>الأبعاد</h2>
          <p uiPopoverDescription>اضبط أبعاد الطبقة.</p>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {}

export { Example }
