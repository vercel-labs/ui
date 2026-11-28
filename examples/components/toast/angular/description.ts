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
    <button (click)="showToast()">Show toast</button>
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
  `,
})
class Example {
  readonly toast = createToaster()

  showToast() {
    this.toast({
      title: "Event has been created",
      description: "Monday, January 3rd at 6:00pm",
    })
  }
}

export { Example }
