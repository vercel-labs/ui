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
      <button uiAlertDialogTrigger>Delete Project</button>
      <div *uiAlertDialogBackdrop></div>
      <div *uiAlertDialogContent>
        <div data-slot="stack">
          <h2 uiAlertDialogTitle>Delete this project?</h2>
          <p uiAlertDialogDescription>
            This permanently deletes the project, its files and its deployment
            history for everyone on your team.
          </p>
        </div>
        <div data-slot="row">
          <button uiAlertDialogClose>Cancel</button>
          <button uiAlertDialogClose data-variant="solid" value="confirm">
            Delete
          </button>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {}

export { Example }
