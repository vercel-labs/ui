import {
  ChangeDetectionStrategy,
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from "@angular/core"
import type { ConfirmEntry, ConfirmOptions } from "@ui-sdk/core/dialog"
import { toasterInternals, type Toaster } from "@ui-sdk/core/renderer"
import type { ToastRegionOptions } from "@ui-sdk/core/toast"
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "./alert-dialog.ts"
import { ToastRegion } from "./toast.ts"
import { HostedRegion } from "./toast-context.ts"

/**
 * What the overlay host passes the toast regions it renders, like `side`. `class` goes on each region.
 * @stable
 */
type OverlayHostToastProps = Pick<
  ToastRegionOptions,
  "side" | "align" | "maxVisible" | "expanded" | "shortcut"
> & {
  /** Class names for each region. */
  class?: string
}

// The alert dialog the host renders for a `confirm()` question.
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "ui-hosted-confirm",
  imports: [
    AlertDialog,
    AlertDialogClose,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
  ],
  template: `
    <ng-container
      uiAlertDialog
      [controller]="entry().controller"
      (openChangeComplete)="$event || entry().done()"
    >
      <div *uiAlertDialogContent>
        <h2 uiAlertDialogTitle>{{ question().title }}</h2>
        @if (question().description) {
          <p uiAlertDialogDescription>{{ question().description }}</p>
        }
        <div>
          <button uiAlertDialogClose>
            {{ question().cancelLabel ?? "Cancel" }}
          </button>
          <button uiAlertDialogClose value="confirm">
            {{ question().confirmLabel ?? "Continue" }}
          </button>
        </div>
      </div>
    </ng-container>
  `,
})
class HostedConfirm {
  readonly entry = input.required<ConfirmEntry>()
  protected readonly question = computed(
    () => (this.entry().payload ?? {}) as Partial<ConfirmOptions>
  )

  constructor() {
    // The alert dialog attached the controller as it rendered, so it can open now.
    afterNextRender(() => this.entry().open())
  }
}

// A toaster's region, unless the app placed one of its own.
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "ui-hosted-toaster",
  imports: [ToastRegion],
  providers: [{ provide: HostedRegion, useValue: true }],
  template: `
    @if (!placed()) {
      <section
        uiToastRegion
        [toaster]="toaster()"
        [side]="region().side"
        [align]="region().align"
        [maxVisible]="region().maxVisible"
        [expanded]="region().expanded"
        [shortcut]="region().shortcut"
        [class]="region().class"
      ></section>
    }
  `,
})
class HostedToaster {
  readonly toaster = input.required<Toaster>()
  readonly props = input<OverlayHostToastProps>()
  protected readonly placed = signal(false)
  // A template's `?.` gives null, which a region reads as a value, so an
  // unset prop stays undefined.
  protected readonly region = computed(() => this.props() ?? {})

  constructor() {
    // Read once it renders, so a region the app placed is never doubled.
    // An entry's toaster never changes.
    let stop = () => {}
    afterNextRender(() => {
      const internals = toasterInternals(this.toaster())
      this.placed.set(internals.hasPlacedRegion())
      stop = this.toaster().subscribe(() =>
        this.placed.set(internals.hasPlacedRegion())
      )
    })
    inject(DestroyRef).onDestroy(() => stop())
  }
}

export { HostedConfirm, HostedToaster, type OverlayHostToastProps }
