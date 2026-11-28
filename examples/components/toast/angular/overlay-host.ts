import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from "@angular/core"
import { LucideCircleCheck } from "@lucide/angular"
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  createConfirm,
  type ConfirmOptions,
} from "@ui-sdk/angular/alert-dialog"
import { OverlayHost, createOverlays } from "@ui-sdk/angular/overlays"
import {
  Toast,
  ToastRegion,
  ToastTitle,
  createToaster,
} from "@ui-sdk/angular/toast"

@Component({
  imports: [
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogClose,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    OverlayHost,
    Toast,
    ToastRegion,
    ToastTitle,
    LucideCircleCheck,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button
          type="button"
          #reset
          (click)="projects.set(['Acme', 'Globex', 'Initech'])"
        >
          Reset Projects
        </button>
      </div>
      <ul data-slot="list" aria-label="Projects">
        @for (name of projects(); track name) {
          <li data-slot="row">
            {{ name }}
            <button
              type="button"
              data-size="sm"
              [attr.aria-label]="\`Delete \${name}\`"
              #button
              (click)="remove(name, button)"
            >
              Delete
            </button>
          </li>
        } @empty {
          <li data-slot="row">All projects deleted.</li>
        }
      </ul>
      <div uiOverlayHost [overlays]="overlays"></div>
      <section uiToastRegion #region="uiToastRegion" [toaster]="toast">
        @for (item of region.state().toasts; track item.toast.id) {
          <li [uiToast]="item.toast">
            <svg lucideCircleCheck data-show="success"></svg>
            <div uiToastTitle></div>
          </li>
        }
      </section>
      <ng-container uiAlertDialog [controller]="confirm.controller">
        <div *uiAlertDialogBackdrop></div>
        <div *uiAlertDialogContent="let content">
          <div data-slot="stack">
            <h2 uiAlertDialogTitle>{{ payloadOf(content)?.title }}</h2>
            <p uiAlertDialogDescription>
              {{ payloadOf(content)?.description }}
            </p>
          </div>
          <div data-slot="row">
            <button uiAlertDialogClose>
              {{ payloadOf(content)?.cancelLabel }}
            </button>
            <button uiAlertDialogClose data-variant="solid" value="confirm">
              {{ payloadOf(content)?.confirmLabel }}
            </button>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly overlays = createOverlays()

  readonly toast = createToaster({ overlays: this.overlays })

  readonly confirm = createConfirm({ overlays: this.overlays })

  readonly projects = signal(["Acme", "Globex", "Initech"])

  readonly reset = viewChild<ElementRef<HTMLButtonElement>>("reset")

  async remove(name: string, button: HTMLButtonElement) {
    const confirmed = await this.confirm({
      title: `Delete ${name}?`,
      description:
        "The project and its files will be deleted for everyone on your team.",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    })
    if (!confirmed) {
      return
    }
    const row = button.closest("li")
    const next = (
      row?.nextElementSibling ?? row?.previousElementSibling
    )?.querySelector("button")
    ;(next ?? this.reset()?.nativeElement)?.focus()
    this.projects.set(this.projects().filter((project) => project !== name))
    this.toast.success(`${name} deleted`, { priority: "assertive" })
  }

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.toast.dismiss()
    })
  }

  payloadOf(state: { payload?: unknown }) {
    return state.payload as ConfirmOptions | undefined
  }
}

export { Example }
