import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
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
    <ng-container
      uiDialog
      (openChangeComplete)="
        log($event ? 'Finished opening' : 'Finished closing')
      "
    >
      <button uiDialogTrigger>Slide In</button>
      <div *uiDialogBackdrop></div>
      <div *uiDialogContent="{ keepMounted: true }">
        <div data-slot="stack">
          <h2 uiDialogTitle>Slide and fade</h2>
          <p uiDialogDescription>
            300ms in and out. Focus returns as soon as it starts closing.
          </p>
        </div>
        <div data-slot="row">
          <button uiDialogClose data-variant="solid">Close</button>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly log = useLog()
}

export { Example }
