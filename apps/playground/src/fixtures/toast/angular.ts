import { Component } from "@angular/core"
import { confirm } from "@ui-sdk/angular/alert-dialog"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/angular/dialog"
import { OverlayHost } from "@ui-sdk/angular/overlays"
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastRegion,
  ToastTitle,
} from "@ui-sdk/angular/toast"
import {
  toastFixture,
  toastOptions,
  usesHost,
} from "../../../../../tests/fixtures/toast"
import { mountAngular, state } from "../../angular-mount"
import { createFixtureToasts } from "./shared"

@Component({
  imports: [
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
    DialogTrigger,
    OverlayHost,
    Toast,
    ToastAction,
    ToastClose,
    ToastDescription,
    ToastRegion,
    ToastTitle,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <button (click)="toasts.basic()">{{ f.basic.trigger }}</button>
      <button (click)="toasts.success()">{{ f.success.trigger }}</button>
      <button (click)="toasts.error()">{{ f.error.trigger }}</button>
      <button (click)="toasts.promise()">{{ f.promise.trigger }}</button>
      <ng-container uiDialog>
        <button uiDialogTrigger>{{ f.dialog.trigger }}</button>
        <div *uiDialogContent class="dialog">
          <h2 uiDialogTitle class="title">{{ f.dialog.title }}</h2>
          <button (click)="toasts.basic()">{{ f.dialog.toast }}</button>
          <button uiDialogClose>{{ f.dialog.close }}</button>
        </div>
      </ng-container>
      @if (host) {
        <button (click)="ask()">{{ f.confirm.trigger }}</button>
      }
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      @if (host) {
        <div uiOverlayHost [toast]="hosted"></div>
      } @else {
        <section
          uiToastRegion
          #region="uiToastRegion"
          class="toast-region"
          [toaster]="toasts.toast"
          [side]="options.side"
          [align]="options.align"
          [maxVisible]="options.maxVisible"
          [expanded]="options.expanded"
          [shortcut]="options.shortcut"
        >
          @for (item of region.state().toasts; track item.toast.id) {
            <li [uiToast]="item.toast" class="toast">
              <div uiToastTitle class="toast-title"></div>
              <div uiToastDescription class="toast-description"></div>
              <button uiToastAction class="toast-action"></button>
              <button uiToastClose class="toast-close">{{ f.dismiss }}</button>
            </li>
          }
        </section>
      }
    </div>
  `,
})
class Fixture {
  readonly f = toastFixture
  readonly host = usesHost()
  readonly options: {
    side?: "top" | "bottom"
    align?: "start" | "center" | "end"
    maxVisible?: number
    expanded?: boolean
    shortcut?: string | null
  } = toastOptions()
  readonly hosted = { ...this.options, class: "toast-region" }
  readonly action = state("")
  readonly toasts = createFixtureToasts<string>((action) =>
    this.action.set(action)
  )

  async ask() {
    const { title, confirm: confirmLabel, cancel } = this.f.confirm
    const yes = await confirm({ title, confirmLabel, cancelLabel: cancel })
    this.action.set(yes ? "confirmed" : "declined")
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
