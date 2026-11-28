import { Component, DestroyRef, inject } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import {
  Toast,
  ToastAction,
  ToastRegion,
  ToastTitle,
  createToaster,
} from "@ui-sdk/angular/toast"

@Component({
  imports: [Toast, ToastAction, ToastRegion, ToastTitle],
  template: `
    <button (click)="sendMessage()">Send Message</button>
    <section
      uiToastRegion
      #region="uiToastRegion"
      [toaster]="toast"
      shortcut="alt+t"
      aria-label="Alerts"
    >
      @for (item of region.state().toasts; track item.toast.id) {
        <li [uiToast]="item.toast">
          <div uiToastTitle></div>
          <button uiToastAction data-variant="solid"></button>
        </li>
      }
    </section>
  `,
})
class Example {
  readonly log = useLog()

  readonly toast = createToaster({ duration: 10000 })

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.toast.dismiss()
    })
  }

  sendMessage() {
    this.toast("Message sent", {
      action: { label: "Undo", onAction: () => this.log("Message unsent") },
    })
  }
}

export { Example }
