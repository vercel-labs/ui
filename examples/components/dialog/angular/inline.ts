import { Component } from "@angular/core"
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/angular/dialog"

@Component({
  imports: [
    Dialog,
    DialogBackdrop,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
  ],
  template: `
    <div data-slot="dialog-frame">
      <ng-container uiDialog modal="trap-focus" [closeOnOutsidePress]="false">
        <button uiDialogTrigger>Delete Draft</button>
        <div *uiDialogBackdrop></div>
        <div *uiDialogContent="{ inline: true }">
          <div data-slot="stack">
            <h2 uiDialogTitle>Delete this draft?</h2>
            <p uiDialogDescription>
              The preview keeps its dialog inside the frame.
            </p>
          </div>
          <div data-slot="row">
            <button uiDialogClose>Cancel</button>
            <button uiDialogClose data-variant="destructive">Delete</button>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {}

export { Example }
