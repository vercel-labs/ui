import { Component, DestroyRef, inject } from "@angular/core"
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
    <button (click)="sendInvoice()">Send Invoice</button>
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
  readonly toast = createToaster()

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.toast.dismiss()
    })
  }

  sendInvoice() {
    this.toast("Invoice sent", {
      description: "Hollis Grant · $240.00",
      action: { label: "View", href: "#" },
    })
  }
}

export { Example }
