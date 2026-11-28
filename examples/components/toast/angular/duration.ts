import { Component, DestroyRef, inject } from "@angular/core"
import {
  Toast,
  ToastClose,
  ToastRegion,
  ToastTitle,
  createToaster,
} from "@ui-sdk/angular/toast"

@Component({
  imports: [Toast, ToastClose, ToastRegion, ToastTitle],
  template: `
    <div data-slot="row">
      <button (click)="toast('Link copied', { duration: 1000 })">
        1 Second
      </button>
      <button (click)="toast('Changes saved')">5 Seconds</button>
      <button (click)="untilDismissed()">Until Dismissed</button>
    </div>
    <section uiToastRegion #region="uiToastRegion" [toaster]="toast">
      @for (item of region.state().toasts; track item.toast.id) {
        <li [uiToast]="item.toast">
          <div uiToastTitle></div>
          @if (item.toast.cancel; as cancel) {
            <button
              uiToastClose
              data-variant="solid"
              (action)="cancel.onCancel?.($event.event, $event)"
            >
              {{ cancel.label }}
            </button>
          }
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

  untilDismissed() {
    this.toast("Your session expires in 5 minutes", {
      duration: Infinity,
      dismissible: false,
      cancel: { label: "Got It" },
    })
  }
}

export { Example }
