import { Component, DestroyRef, inject } from "@angular/core"
import {
  LucideCircleCheck,
  LucideInfo,
  LucideLoaderCircle,
  LucideOctagonX,
  LucideTriangleAlert,
} from "@lucide/angular"
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
    LucideInfo,
    LucideLoaderCircle,
    LucideOctagonX,
    LucideTriangleAlert,
  ],
  template: `
    <div data-slot="row">
      <button (click)="toast('Event created')">Default</button>
      <button (click)="toast.success('Changes saved')">Success</button>
      <button (click)="toast.info('A new version is available')">Info</button>
      <button (click)="toast.warning('Storage is almost full')">Warning</button>
      <button (click)="toast.error('Couldn\\'t save changes')">Error</button>
      <button (click)="loading()">Loading</button>
    </div>
    <section uiToastRegion #region="uiToastRegion" [toaster]="toast">
      @for (item of region.state().toasts; track item.toast.id) {
        <li [uiToast]="item.toast">
          <svg lucideCircleCheck data-show="success"></svg>
          <svg lucideInfo data-show="info"></svg>
          <svg lucideTriangleAlert data-show="warning"></svg>
          <svg lucideOctagonX data-show="error"></svg>
          <svg lucideLoaderCircle data-show="loading"></svg>
          <div uiToastTitle></div>
        </li>
      }
    </section>
  `,
})
class Example {
  readonly upload = () => {
    return new Promise((resolve) => setTimeout(resolve, 2000))
  }

  readonly toast = createToaster()

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.toast.dismiss()
    })
  }

  loading() {
    this.toast.promise(this.upload, {
      loading: "Uploading photos…",
      success: "Photos uploaded",
      error: "Upload failed",
    })
  }
}

export { Example }
