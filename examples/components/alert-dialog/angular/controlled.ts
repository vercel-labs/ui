import { Component, signal } from "@angular/core"
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ui-sdk/angular/alert-dialog"

@Component({
  imports: [
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogClose,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogTrigger,
  ],
  template: `
    <div data-slot="stack">
      <ng-container uiAlertDialog [(open)]="open">
        <button uiAlertDialogTrigger>Review Changes</button>
        <div *uiAlertDialogBackdrop></div>
        <div *uiAlertDialogContent>
          <div data-slot="stack">
            <h2 uiAlertDialogTitle>Discard unsaved changes?</h2>
            <p uiAlertDialogDescription>
              Your edits will be lost if you leave without saving.
            </p>
          </div>
          <div data-slot="row">
            <button uiAlertDialogClose>Keep Editing</button>
            <button uiAlertDialogClose data-variant="solid" value="confirm">
              Discard
            </button>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly open = signal(false)
}

export { Example }
