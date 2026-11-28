import { Component, DestroyRef, inject } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastRegion,
  ToastTitle,
  createToaster,
} from "@ui-sdk/angular/toast"

@Component({
  imports: [Toast, ToastAction, ToastClose, ToastRegion, ToastTitle],
  template: `
    <button (click)="archiveMessage()">Archive Message</button>
    <section uiToastRegion #region="uiToastRegion" [toaster]="toast">
      @for (item of region.state().toasts; track item.toast.id) {
        <li [uiToast]="item.toast">
          <div uiToastTitle></div>
          @if (item.toast.cancel; as cancel) {
            <button
              uiToastClose
              (action)="cancel.onCancel?.($event.event, $event)"
            >
              {{ cancel.label }}
            </button>
          }
          <button uiToastAction data-variant="solid"></button>
        </li>
      }
    </section>
  `,
})
class Example {
  readonly log = useLog()

  readonly toast = createToaster()

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.toast.dismiss()
    })
  }

  archiveMessage() {
    this.toast("Message archived", {
      action: { label: "Undo", onAction: () => this.log("Message restored") },
      cancel: { label: "Dismiss", onCancel: () => this.log("Kept archived") },
      onDismiss: ({ reason }) => this.log(`Closed (${reason})`),
    })
  }
}

export { Example }
