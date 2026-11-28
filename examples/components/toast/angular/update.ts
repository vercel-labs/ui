import { Component, DestroyRef, inject, signal } from "@angular/core"
import { LucideCircleCheck, LucideLoaderCircle } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  Toast,
  ToastRegion,
  ToastTitle,
  createToaster,
} from "@ui-sdk/angular/toast"

@Component({
  imports: [
    Toast,
    ToastRegion,
    ToastTitle,
    LucideCircleCheck,
    LucideLoaderCircle,
  ],
  template: `
    <div data-slot="row">
      <button (click)="upload()">Upload Report</button>
      <button (click)="toast.dismiss('upload')">Cancel Upload</button>
      <button (click)="toast.dismiss()">Dismiss All</button>
    </div>
    <section uiToastRegion #region="uiToastRegion" [toaster]="toast">
      @for (item of region.state().toasts; track item.toast.id) {
        <li [uiToast]="item.toast">
          <svg lucideCircleCheck data-show="success"></svg>
          <svg lucideLoaderCircle data-show="loading"></svg>
          <div uiToastTitle></div>
        </li>
      }
    </section>
  `,
})
class Example {
  readonly log = useLog()

  readonly toast = createToaster()

  readonly timer = signal<
    ReturnType<typeof setInterval> | undefined | undefined
  >(undefined)

  upload() {
    clearInterval(this.timer())
    const id = this.toast.loading("Uploading report.pdf… 0%", { id: "upload" })
    let progress = 0
    this.timer.set(
      setInterval(() => {
        progress += 20
        const done = progress >= 100
        const open = this.toast.update(
          id,
          done
            ? { title: "Report uploaded", type: "success" }
            : { title: `Uploading report.pdf… ${progress}%` }
        )
        if (!open) {
          this.log("Upload canceled")
        }
        if (done || !open) {
          clearInterval(this.timer())
        }
      }, 700)
    )
  }

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      clearInterval(this.timer())
      this.toast.dismiss()
    })
  }
}

export { Example }
