import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import {
  createDialogController,
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  type DialogContentState,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  type DialogOpenChange,
} from "@ui-sdk/angular/dialog"

type Invoice = {
  id: string
  customer: string
  amount: string
  status: "Paid" | "Due"
}

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
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="remindFromCode()">Open from Code</button>
      </div>
      <ul data-slot="list">
        @for (invoice of invoices; track invoice.id) {
          <li data-slot="row">
            {{ invoice.customer }}
            <span data-slot="hint"
              >{{ invoice.amount }} · {{ invoice.status }}</span
            >
            <button
              uiDialogTrigger
              [controller]="reminder"
              [payload]="invoice"
              [disabled]="invoice.status === 'Paid'"
              [attr.aria-label]="\`Remind \${invoice.customer}\`"
            >
              Remind
            </button>
          </li>
        }
      </ul>
      <ng-container
        uiDialog
        [controller]="reminder"
        (beforeOpenChange)="onOpenChange($event)"
      >
        <div *uiDialogBackdrop></div>
        <div *uiDialogContent="let content">
          <div data-slot="stack">
            <h2 uiDialogTitle>Remind {{ payloadOf(content)?.customer }}</h2>
            <p uiDialogDescription>
              {{ payloadOf(content)?.id }} for
              {{ payloadOf(content)?.amount }} is due. We'll email the billing
              contact.
            </p>
          </div>
          <div data-slot="row">
            <button uiDialogClose>Cancel</button>
            <button uiDialogClose data-variant="solid" value="send">
              Send reminder
            </button>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly invoices: Invoice[] = [
    { id: "INV-001", customer: "Acme", amount: "$250.00", status: "Paid" },
    { id: "INV-002", customer: "Globex", amount: "$150.00", status: "Due" },
    { id: "INV-003", customer: "Initech", amount: "$350.00", status: "Due" },
  ]

  readonly reminder = createDialogController<Invoice, "send">()

  readonly log = useLog()

  async remindFromCode() {
    const { reason, returnValue } = await this.reminder.open({
      payload: this.invoices[2],
    })
    this.log(
      returnValue === "send" ? "Reminder sent from code" : `Closed (${reason})`
    )
  }

  payloadOf(state: { payload?: unknown }) {
    return state.payload as Invoice | undefined
  }

  onOpenChange(change: DialogOpenChange) {
    if (!change.value && change.returnValue === "send") {
      this.log("Reminder sent")
    }
  }
}

export { Example }
