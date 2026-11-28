import { Component } from "@angular/core"
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
    <ng-container uiAlertDialog>
      <button uiAlertDialogTrigger>Leave Workspace</button>
      <div *uiAlertDialogBackdrop></div>
      <div *uiAlertDialogContent>
        <div data-slot="stack">
          <h2 uiAlertDialogTitle>Leave this workspace?</h2>
          <p uiAlertDialogDescription>
            You'll lose access to its projects until someone invites you again.
          </p>
        </div>
        <div data-slot="row">
          <button uiAlertDialogClose>Cancel</button>
          <button uiAlertDialogClose data-variant="solid" value="confirm">
            Leave
          </button>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {}

export { Example }
