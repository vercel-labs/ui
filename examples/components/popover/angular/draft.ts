import { Component, ElementRef, signal, viewChild } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import { Field, FieldControl, FieldLabel } from "@ui-sdk/angular/field"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
  type PopoverDismissReason,
} from "@ui-sdk/angular/popover"
import { type DismissAttemptDetails } from "@ui-sdk/core"

@Component({
  imports: [
    Field,
    FieldControl,
    FieldLabel,
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
      [open]="open()"
      (openChange)="$event ? open.set(true) : close()"
      [dismissible]="note() === ''"
      (dismissAttempt)="onDismissAttempt($event)"
    >
      <button uiPopoverTrigger>Add Note</button>
      <div *uiPopoverContent>
        <h2 uiPopoverTitle>Add a note</h2>
        <p uiPopoverDescription>Only your team can see it.</p>
        <div uiField>
          <label uiFieldLabel>Note</label>
          <textarea
            uiFieldControl
            [value]="note()"
            (input)="note.set(field.value)"
            #field
            placeholder="Call the printer about the proofs."
          ></textarea>
        </div>
        @if (asking()) {
          <div data-slot="row" role="alert">
            Discard your note?
            <div data-slot="row">
              <button type="button" data-size="sm" (click)="keepEditing()">
                Keep Editing
              </button>
              <button
                type="button"
                data-size="sm"
                data-variant="solid"
                (click)="discard()"
              >
                Discard
              </button>
            </div>
          </div>
        } @else {
          <div data-slot="row">
            <button uiPopoverClose>Cancel</button>
            <button type="button" data-variant="solid" (click)="save()">
              Save
            </button>
          </div>
        }
      </div>
    </ng-container>
  `,
})
class Example {
  readonly log = useLog()

  readonly open = signal(false)

  readonly note = signal("")

  readonly asking = signal(false)

  readonly field = viewChild<ElementRef<HTMLTextAreaElement>>("field")

  close() {
    this.open.set(false)
    this.note.set("")
    this.asking.set(false)
  }

  onDismissAttempt(details: DismissAttemptDetails<PopoverDismissReason>) {
    this.log(`Kept open (${details.reason})`)
    this.asking.set(true)
  }

  keepEditing() {
    this.asking.set(false)
    this.field()?.nativeElement?.focus()
  }

  discard() {
    this.log("Discarded the note")
    this.close()
  }

  save() {
    this.log(this.note() ? "Saved the note" : "Nothing to save")
    this.close()
  }
}

export { Example }
