import { Component } from "@angular/core"
import {
  Toast,
  ToastDescription,
  ToastRegion,
  ToastTitle,
  createToaster,
} from "@ui-sdk/angular/toast"

@Component({
  imports: [Toast, ToastDescription, ToastRegion, ToastTitle],
  template: `
    <div dir="rtl">
      <button (click)="onClick()">إظهار الإشعار</button>
      <section uiToastRegion #region="uiToastRegion" [toaster]="toast">
        @for (item of region.state().toasts; track item.toast.id) {
          <li [uiToast]="item.toast">
            <div data-slot="stack">
              <div uiToastTitle></div>
              <div uiToastDescription></div>
            </div>
          </li>
        }
      </section>
    </div>
  `,
})
class Example {
  readonly toast = createToaster()

  onClick() {
    this.toast("تم إنشاء الحدث", {
      description: "الأحد 3 ديسمبر الساعة 9:00 صباحًا",
    })
  }
}

export { Example }
