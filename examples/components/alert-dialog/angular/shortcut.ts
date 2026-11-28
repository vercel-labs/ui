import { Component } from "@angular/core"
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogShortcut,
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
    AlertDialogShortcut,
    AlertDialogTitle,
    AlertDialogTrigger,
  ],
  template: `
    <ng-container uiAlertDialog>
      <button uiAlertDialogTrigger shortcut="mod+shift+h">
        Clear History
        <kbd uiAlertDialogShortcut></kbd>
      </button>
      <div *uiAlertDialogBackdrop></div>
      <div *uiAlertDialogContent>
        <div data-slot="stack">
          <h2 uiAlertDialogTitle>Clear your history?</h2>
          <p uiAlertDialogDescription>
            Recent searches and visited pages are removed from this device.
          </p>
        </div>
        <div data-slot="row">
          <button uiAlertDialogClose>Cancel</button>
          <button uiAlertDialogClose data-variant="solid" value="confirm">
            Clear
          </button>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {}

export { Example }
