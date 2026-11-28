import { Component } from "@angular/core"
import { LucideX } from "@lucide/angular"
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/angular/dialog"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import { Input } from "@ui-sdk/angular/input"

@Component({
  imports: [
    Dialog,
    DialogBackdrop,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
    Field,
    FieldLabel,
    Input,
    LucideX,
  ],
  template: `
    <ng-container uiDialog>
      <button uiDialogTrigger>Share</button>
      <div *uiDialogBackdrop></div>
      <div *uiDialogContent>
        <div data-slot="stack">
          <h2 uiDialogTitle>Share link</h2>
          <p uiDialogDescription>
            Anyone who has this link will be able to view this.
          </p>
        </div>
        <div uiField>
          <label uiFieldLabel>Link</label>
          <input uiInput defaultValue="https://example.com/project" readonly />
        </div>
        <div data-slot="row">
          <button uiDialogClose data-variant="solid">Done</button>
        </div>
        <button uiDialogClose aria-label="Close">
          <svg lucideX></svg>
        </button>
      </div>
    </ng-container>
  `,
})
class Example {}

export { Example }
