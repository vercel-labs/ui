import { Component, DestroyRef, inject, signal } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/angular/checkbox"
import {
  Toast,
  ToastDescription,
  ToastRegion,
  ToastTitle,
  createToaster,
} from "@ui-sdk/angular/toast"

@Component({
  imports: [
    Checkbox,
    CheckboxIndicator,
    Toast,
    ToastDescription,
    ToastRegion,
    ToastTitle,
    LucideCheck,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <label data-slot="label">
          <button
            uiCheckbox
            [checked]="expanded()"
            (beforeCheckedChange)="expanded.set($event.value === true)"
          >
            <span uiCheckboxIndicator>
              <svg lucideCheck></svg>
            </span>
          </button>
          Always expanded
        </label>
      </div>
      <button (click)="addToast()">Add Toast</button>
      <section
        uiToastRegion
        #region="uiToastRegion"
        [toaster]="toast"
        [maxVisible]="4"
        [expanded]="expanded()"
      >
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
  readonly notifications = [
    { title: "Event created", description: "Friday, June 12 at 10:00 AM" },
    { title: "Message sent" },
    {
      title: "Hollis Grant joined",
      description: "They can now edit the Launch plan and see its comments.",
    },
    { title: "Changes saved" },
    { title: "Invoice sent", description: "Inès Moreau · $240.00" },
    { title: "Photos uploaded", description: "12 photos added to Summer trip" },
  ]

  readonly toast = createToaster()

  readonly expanded = signal(false)

  count = 0

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.toast.dismiss()
    })
  }

  addToast() {
    this.toast(this.notifications[this.count++ % this.notifications.length])
  }
}

export { Example }
