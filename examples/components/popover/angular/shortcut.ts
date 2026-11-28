import { Component } from "@angular/core"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import { Input } from "@ui-sdk/angular/input"
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
    Field,
    FieldLabel,
    Input,
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
      <button uiPopoverTrigger shortcut="mod+i">
        Invite
        <kbd uiPopoverShortcut></kbd>
      </button>
      <div *uiPopoverContent>
        <h2 uiPopoverTitle>Invite people</h2>
        <p uiPopoverDescription>They'll get an email with a link to join.</p>
        <div uiField>
          <label uiFieldLabel>Email</label>
          <input uiInput type="email" placeholder="wren@example.com" />
        </div>
        <div data-slot="row">
          <button uiPopoverClose>Cancel</button>
          <button uiPopoverClose data-variant="solid">Send Invite</button>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {}

export { Example }
