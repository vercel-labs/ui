import { Component, DestroyRef, inject } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import {
  Toast,
  ToastAction,
  ToastDescription,
  ToastRegion,
  ToastTitle,
  createToaster,
} from "@ui-sdk/angular/toast"

@Component({
  imports: [Toast, ToastAction, ToastDescription, ToastRegion, ToastTitle],
  template: `
    <button (click)="createEvent()">Create Event</button>
    <section uiToastRegion #region="uiToastRegion" [toaster]="toast">
      @for (item of region.state().toasts; track item.toast.id) {
        <li [uiToast]="item.toast">
          <div data-slot="stack">
            <div uiToastTitle></div>
            <div uiToastDescription></div>
          </div>
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

  createEvent() {
    this.toast("Event created", {
      description: "Friday, June 12 at 10:00 AM",
      action: { label: "Undo", onAction: () => this.log("Event removed") },
    })
  }
}

export { Example }
