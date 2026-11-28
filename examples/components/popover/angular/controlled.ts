import { Component, ElementRef, signal, viewChild } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/angular/checkbox"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import { Input } from "@ui-sdk/angular/input"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
  type PopoverOpenChange,
} from "@ui-sdk/angular/popover"

@Component({
  imports: [
    Checkbox,
    CheckboxIndicator,
    Field,
    FieldLabel,
    Input,
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverDescription,
    PopoverTitle,
    PopoverTrigger,
    LucideCheck,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls" #controls>
        <label data-slot="label">
          <button
            uiCheckbox
            [checked]="open()"
            (beforeCheckedChange)="open.set($event.value === true)"
          >
            <span uiCheckboxIndicator>
              <svg lucideCheck></svg>
            </span>
          </button>
          Open
        </label>
      </div>
      <ng-container
        uiPopover
        [(open)]="open"
        (beforeOpenChange)="onOpenChange($event)"
      >
        <button uiPopoverTrigger>Set Status</button>
        <div *uiPopoverContent>
          <h2 uiPopoverTitle>Set a status</h2>
          <p uiPopoverDescription>Your team sees it next to your name.</p>
          <div uiField>
            <label uiFieldLabel>Status</label>
            <input uiInput defaultValue="In a meeting" />
          </div>
          <div data-slot="row">
            <button uiPopoverClose>Cancel</button>
            <button uiPopoverClose data-variant="solid">Save</button>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly log = useLog()

  readonly open = signal(false)

  readonly controls = viewChild<ElementRef<HTMLDivElement>>("controls")

  onOpenChange(change: PopoverOpenChange) {
    const target = change.event?.target
    const inControls =
      target instanceof Node && this.controls()?.nativeElement?.contains(target)
    if (inControls && change.reason !== "escape-key") {
      return change.cancel()
    }
    this.log(`${change.value ? "Opened" : "Closed"} (${change.reason})`)
  }
}

export { Example }
