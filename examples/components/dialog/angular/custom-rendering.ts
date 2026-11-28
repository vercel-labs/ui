import { Component } from "@angular/core"
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogShortcut,
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
    DialogShortcut,
    DialogTitle,
    DialogTrigger,
  ],
  template: `
    <ng-container uiDialog>
      <button uiDialogTrigger #dialogTrigger="uiDialogTrigger" shortcut="mod+i">
        {{ dialogTrigger.state().open ? "Viewing" : "View Details" }}
        <kbd uiDialogShortcut #dialogShortcut="uiDialogShortcut">{{
          dialogShortcut.state().text
        }}</kbd>
      </button>
      <div *uiDialogBackdrop></div>
      <div *uiDialogContent="let content">
        <div data-slot="stack">
          <h3 uiDialogTitle>Details</h3>
          <p uiDialogDescription>
            {{
              content.nested
                ? "Opened from another dialog."
                : "Quarterly report, updated today."
            }}
          </p>
        </div>
        <div data-slot="row">
          <button uiDialogClose>Close</button>
          <a
            uiDialogClose
            data-variant="solid"
            href="https://example.com/details"
            >Open the Full Page</a
          >
        </div>
      </div>
    </ng-container>
  `,
})
class Example {}

export { Example }
