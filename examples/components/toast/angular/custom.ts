import { Component, DestroyRef, inject } from "@angular/core"
import { LucideX } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastRegion,
  ToastTitle,
  createToaster,
} from "@ui-sdk/angular/toast"

@Component({
  imports: [
    Toast,
    ToastAction,
    ToastClose,
    ToastDescription,
    ToastRegion,
    ToastTitle,
    LucideX,
  ],
  template: `
    <button (click)="newMessage()">New Message</button>
    <section
      uiToastRegion
      #region="uiToastRegion"
      [toaster]="toast"
      aria-label="Messages"
    >
      @for (item of region.state().toasts; track item.toast.id) {
        <li
          [uiToast]="item.toast"
          #toast="uiToast"
          [inert]="
            toast.state().leaving ||
            (!toast.state().expanded && toast.state().index > 0) ||
            undefined
          "
        >
          <span data-slot="media">{{ initialsOf(item.toast.data) }}</span>
          <div data-slot="stack">
            <div uiToastTitle></div>
            <div uiToastDescription></div>
          </div>
          <button uiToastAction data-variant="solid"></button>
          <button uiToastClose aria-label="Close">
            <svg lucideX></svg>
          </button>
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

  newMessage() {
    this.toast({
      title: "Hollis Grant",
      description: "Can you review the draft?",
      data: { initials: "HG" },
      action: {
        label: "Reply",
        onAction: () => this.log("Replying to Hollis Grant"),
      },
    })
  }

  initialsOf(data: unknown) {
    return (data as { initials: string }).initials
  }
}

export { Example }
