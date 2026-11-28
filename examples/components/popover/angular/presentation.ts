import { Component } from "@angular/core"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import { Input } from "@ui-sdk/angular/input"
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
    Field,
    FieldLabel,
    Input,
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverDescription,
    PopoverTitle,
    PopoverTrigger,
  ],
  template: `
    <ng-container uiPopover presentation="sheet">
      <button uiPopoverTrigger>Add Reminder</button>
      <div *uiPopoverContent>
        <h2 uiPopoverTitle>New reminder</h2>
        <p uiPopoverDescription>We'll notify you at the time you pick.</p>
        <div uiField>
          <label uiFieldLabel>Remind me to</label>
          <input uiInput defaultValue="Send the Q3 roadmap" />
        </div>
        <div data-slot="row">
          <button uiPopoverClose>Cancel</button>
          <button uiPopoverClose data-variant="solid">Save</button>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {}

export { Example }
