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
    <button (click)="deleteFile()">Delete File</button>
    <section uiToastRegion #region="uiToastRegion" [toaster]="toast">
      @for (item of region.state().toasts; track item.toast.id) {
        <li [uiToast]="item.toast">
          <div data-slot="stack">
            <div uiToastTitle></div>
            <div uiToastDescription></div>
          </div>
          <button
            uiToastAction
            #toastAction="uiToastAction"
            data-variant="solid"
          >
            {{
              toastAction.state().pending
                ? "Restoring…"
                : toastAction.state().error
                  ? "Retry"
                  : "Undo"
            }}
          </button>
        </li>
      }
    </section>
  `,
})
class Example {
  restore() {
    return new Promise((resolve) => setTimeout(resolve, 1500))
  }

  readonly log = useLog()

  readonly toast = createToaster({ duration: 6000 })

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.toast.dismiss()
    })
  }

  deleteFile() {
    this.toast("File deleted", {
      description: "Q3 report.pdf",
      action: {
        label: "Undo",
        onAction: async () => {
          await this.restore()
          this.log("Q3 report.pdf restored")
        },
      },
    })
  }
}

export { Example }
