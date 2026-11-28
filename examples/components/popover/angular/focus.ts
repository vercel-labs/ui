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
    <div data-slot="row">
      <ng-container uiPopover>
        <button uiPopoverTrigger>Rename</button>
        <div *uiPopoverContent>
          <h2 uiPopoverTitle>Rename file</h2>
          <p uiPopoverDescription>Focus starts in the first field.</p>
          <div uiField>
            <label uiFieldLabel>Name</label>
            <input uiInput defaultValue="Q3 roadmap.pdf" />
          </div>
          <div data-slot="row">
            <button uiPopoverClose>Cancel</button>
            <button uiPopoverClose data-variant="solid">Save</button>
          </div>
        </div>
      </ng-container>
      <ng-container uiPopover>
        <button uiPopoverTrigger>Publish</button>
        <div *uiPopoverContent="{ initialFocus: '[data-autofocus]' }">
          <h2 uiPopoverTitle>Publish changes?</h2>
          <p uiPopoverDescription>Focus starts on Publish, not Cancel.</p>
          <div data-slot="row">
            <button uiPopoverClose>Cancel</button>
            <button uiPopoverClose data-autofocus="" data-variant="solid">
              Publish
            </button>
          </div>
        </div>
      </ng-container>
      <ng-container uiPopover>
        <button uiPopoverTrigger>Status</button>
        <div *uiPopoverContent="{ initialFocus: 'none', finalFocus: 'none' }">
          <h2 uiPopoverTitle>All systems normal</h2>
          <p uiPopoverDescription>Focus stays on the trigger.</p>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {}

export { Example }
