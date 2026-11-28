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
    <button (click)="saveChanges()">Save Changes</button>
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

  attempts = 0

  readonly save = () => {
    const succeeds = ++this.attempts % 2 === 1
    return new Promise<void>((resolve, reject) =>
      setTimeout(
        () => (succeeds ? resolve() : reject(new Error("Network error"))),
        1500
      )
    )
  }

  readonly saveChanges = () => {
    this.toast.promise(this.save, {
      loading: "Saving changes…",
      success: "Changes saved",
      error: {
        title: "Couldn't save changes",
        description: "Check your connection and try again.",
        action: { label: "Retry", onAction: this.saveChanges },
      },
    })
  }

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.toast.dismiss()
    })
  }
}

export { Example }
