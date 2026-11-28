import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  createConfirm,
} from "@ui-sdk/angular/alert-dialog"
import { type DialogContentState } from "@ui-sdk/angular/dialog"

@Component({
  imports: [
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogClose,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
  ],
  template: `
    <div data-slot="stack">
      <button type="button" (click)="review()">Review Two Projects</button>
      <ng-container uiAlertDialog [controller]="confirm.controller">
        <div *uiAlertDialogBackdrop></div>
        <div *uiAlertDialogContent="let content">
          <div data-slot="stack">
            <h2 uiAlertDialogTitle>Archive {{ payloadOf(content)?.name }}?</h2>
            <p uiAlertDialogDescription>
              Archived projects leave the active list. You can restore them
              later.
            </p>
          </div>
          <div data-slot="row">
            <button uiAlertDialogClose>Cancel</button>
            <button uiAlertDialogClose data-variant="solid" value="confirm">
              Archive
            </button>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly confirm = createConfirm<{ name: string }>()

  readonly log = useLog()

  async review() {
    const acme = this.confirm({ name: "Acme" })
    const globex = this.confirm({ name: "Globex" })
    const [first, second] = await Promise.all([acme, globex])
    this.log(`Acme: ${first ? "confirmed" : "canceled"}`)
    this.log(`Globex: ${second ? "confirmed" : "canceled"}`)
  }

  payloadOf(state: { payload?: unknown }) {
    return state.payload as { name: string } | undefined
  }
}

export { Example }
