import { Component, signal } from "@angular/core"
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  type AlertDialogOpenChange,
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
    <ng-container uiAlertDialog [(open)]="open">
      <button uiAlertDialogTrigger>Delete Workspace</button>
      <div *uiAlertDialogBackdrop></div>
      <div *uiAlertDialogContent>
        <div data-slot="stack">
          <h2 uiAlertDialogTitle>Delete this workspace?</h2>
          <p uiAlertDialogDescription>
            All 12 projects and their deployments will be deleted for everyone
            on your team.
          </p>
        </div>
        <div data-slot="row">
          <button uiAlertDialogClose>Cancel</button>
          <ng-container uiAlertDialog (beforeOpenChange)="onOpenChange($event)">
            <button uiAlertDialogTrigger data-variant="solid">Delete</button>
            <div *uiAlertDialogBackdrop></div>
            <div *uiAlertDialogContent>
              <div data-slot="stack">
                <h2 uiAlertDialogTitle>Are you absolutely sure?</h2>
                <p uiAlertDialogDescription>
                  There's no way to get the workspace back.
                </p>
              </div>
              <div data-slot="row">
                <button uiAlertDialogClose>Go Back</button>
                <button uiAlertDialogClose data-variant="solid" value="confirm">
                  Delete Workspace
                </button>
              </div>
            </div>
          </ng-container>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly open = signal(false)

  onOpenChange(change: AlertDialogOpenChange) {
    if (!change.value && change.returnValue === "confirm") {
      this.open.set(false)
    }
  }
}

export { Example }
